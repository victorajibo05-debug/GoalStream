"""
prepare_data.py
---------------
Reads the raw Kaggle World Cup CSV and produces a clean matches.csv
...
"""

import pandas as pd
import os

""" Paths to raw and clean data files. """

RAW_PATH = os.path.join(os.path.dirname(__file__), "raw", "FIFA_World_Cup_1930-2022_All_Match_Dataset.csv")
OUT_PATH = os.path.join(os.path.dirname(__file__), "matches.csv")


print("Loading raw file...")
df = pd.read_csv(RAW_PATH, encoding="latin-1")
print(f"Loaded {len(df)} rows, {len(df.columns)} columns ")

""" Selecting columns I need from matches.csv """
df = df[[
    "Match Date",
    "Home Team Name",
    "Away Team Name",
    "Home Team Score",
    "Away Team Score",
    "Result",
    "Stage Name",
    "Extra Time",
    "Penalty Shootout",
    "tournament Name",
]].copy()

""" Renaming columns to match the database schema. """
df = df.rename(columns={
    "Match Date":      "date",
    "Home Team Name":  "home_team",
    "Away Team Name":  "away_team",
    "Home Team Score": "home_goals",
    "Away Team Score": "away_goals",
    "Result":          "result_raw",
    "Stage Name":      "stage",
    "Extra Time":      "extra_time",
    "Penalty Shootout":"penalty_shootout",
    "tournament Name": "tournament",
})

""" Converting dates to usable format. """
df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")


""" Converting results to match database schema. """
result_map = {
    "home team win": "H",
    "draw":          "D",
    "away team win": "A",
}

df["result"] = df["result_raw"].str.strip().str.lower().map(result_map)

unmapped = df["result"].isnull().sum()
if unmapped > 0:
    print(f"  WARNING: {unmapped} rows have unrecognised result values:")
    print(df[df["result"].isnull()]["result_raw"].unique())
else:
    print("  All results mapped cleanly to H/D/A")

df = df.drop(columns=["result_raw"])

# (already kept as "penalty_shootout" — 1 if went to penalties, 0 if not)
print("  Penalty shootout flag kept as-is")

df["year"] = pd.to_datetime(df["date"]).dt.year
df = df.sort_values("date").reset_index(drop=True)

df = df[[
    "date", "year", "tournament", "stage",
    "home_team", "away_team",
    "home_goals", "away_goals", "result",
    "extra_time", "penalty_shootout",
]]

os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
df.to_csv(OUT_PATH, index=False)

print(f"Total matches:       {len(df)}")
print(f"Date range:          {df['date'].min()}  to  {df['date'].max()}")
print(f"Unique teams:        {pd.concat([df['home_team'], df['away_team']]).nunique()}")

counts = df["result"].value_counts()
for label, code in [("Home wins (H)", "H"), ("Draws (D)", "D"), ("Away wins (A)", "A")]:
    n = counts.get(code, 0)
    pct = n / len(df) * 100
    print(f"  {label}: {n}  ({pct:.1f}%)")
