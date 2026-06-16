"""
features.py
-----------
Builds prediction features from historical World Cup match data.
The main function you call is build_match_features().
"""

import pandas as pd
import numpy as np


# ---------------------------------------------------------------------------
# ELO RATING SYSTEM
# ---------------------------------------------------------------------------

INITIAL_ELO = 1500
K_FACTOR = 40


def expected_score(elo_a, elo_b):
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


def update_elo(elo_home, elo_away, result):
    exp_home = expected_score(elo_home, elo_away)
    exp_away = 1 - exp_home

    score_home = {"H": 1.0, "D": 0.5, "A": 0.0}[result]
    score_away = 1.0 - score_home

    new_home = elo_home + K_FACTOR * (score_home - exp_home)
    new_away = elo_away + K_FACTOR * (score_away - exp_away)

    return new_home, new_away


def compute_elo_ratings(df):
    elos = {}

    for _, row in df.sort_values("date").iterrows():
        home = row["home_team"]
        away = row["away_team"]

        if home not in elos:
            elos[home] = INITIAL_ELO
        if away not in elos:
            elos[away] = INITIAL_ELO

        elos[home], elos[away] = update_elo(elos[home], elos[away], row["result"])

    return elos


# ---------------------------------------------------------------------------
# STAGE WEIGHTS
# ---------------------------------------------------------------------------

STAGE_WEIGHTS = {
    "group stage":    1.0,
    "round of 16":    1.5,
    "quarter-finals": 1.8,
    "semi-finals":    2.0,
    "third place":    1.5,
    "final":          2.5,
}


def get_stage_weight(stage):
    if pd.isna(stage):
        return 1.0
    stage_lower = str(stage).lower().strip()
    for key, weight in STAGE_WEIGHTS.items():
        if key in stage_lower:
            return weight
    return 1.0


# ---------------------------------------------------------------------------
# TEAM FORM
# ---------------------------------------------------------------------------

def team_form(df, team, before_date, n=10):
    mask = (
        ((df["home_team"] == team) | (df["away_team"] == team))
        & (df["date"] < before_date)
    )
    recent = df[mask].sort_values("date", ascending=False).head(n)

    if recent.empty:
        return {
            "form_points":          0.0,
            "form_weighted_points": 0.0,
            "form_goals_scored":    0.0,
            "form_goals_conceded":  0.0,
            "form_clean_sheets":    0.0,
            "form_wins":            0.0,
            "form_draws":           0.0,
            "form_losses":          0.0,
            "form_goal_diff":       0.0,
            "form_matches":         0,
        }

    points = wins = draws = losses = clean_sheets = 0
    goals_for = goals_against = 0.0
    weighted_points = 0.0
    total_weight = 0.0

    for _, r in recent.iterrows():
        if r["home_team"] == team:
            gf = r["home_goals"]
            ga = r["away_goals"]
            won  = r["result"] == "H"
            drew = r["result"] == "D"
        else:
            gf = r["away_goals"]
            ga = r["home_goals"]
            won  = r["result"] == "A"
            drew = r["result"] == "D"

        weight = get_stage_weight(r.get("stage", ""))

        goals_for     += gf
        goals_against += ga

        if ga == 0:
            clean_sheets += 1

        if won:
            points += 3
            wins   += 1
            weighted_points += 3 * weight
        elif drew:
            points += 1
            draws  += 1
            weighted_points += 1 * weight
        else:
            losses += 1

        total_weight += weight

    n_actual = len(recent)

    return {
        "form_points":          points / (n_actual * 3),
        "form_weighted_points": weighted_points / (total_weight * 3) if total_weight > 0 else 0.0,
        "form_goals_scored":    goals_for / n_actual,
        "form_goals_conceded":  goals_against / n_actual,
        "form_clean_sheets":    clean_sheets / n_actual,
        "form_wins":            wins / n_actual,
        "form_draws":           draws / n_actual,
        "form_losses":          losses / n_actual,
        "form_goal_diff":       (goals_for - goals_against) / n_actual,
        "form_matches":         n_actual,
    }


# ---------------------------------------------------------------------------
# HEAD TO HEAD
# ---------------------------------------------------------------------------

def h2h_features(df, home_team, away_team, before_date, n=8):
    mask = (
        (
            (df["home_team"] == home_team) & (df["away_team"] == away_team)
        ) | (
            (df["home_team"] == away_team) & (df["away_team"] == home_team)
        )
    ) & (df["date"] < before_date)

    recent = df[mask].sort_values("date", ascending=False).head(n)

    if recent.empty:
        return {
            "h2h_home_win_rate":  0.40,
            "h2h_draw_rate":      0.25,
            "h2h_away_win_rate":  0.35,
            "h2h_matches":        0,
            "h2h_home_goals_avg": 1.2,
            "h2h_away_goals_avg": 1.0,
        }

    home_wins = draws = away_wins = 0
    home_goals = away_goals = 0.0

    for _, r in recent.iterrows():
        if r["home_team"] == home_team:
            if r["result"] == "H":
                home_wins += 1
            elif r["result"] == "D":
                draws += 1
            else:
                away_wins += 1
            home_goals += r["home_goals"]
            away_goals += r["away_goals"]
        else:
            if r["result"] == "A":
                home_wins += 1
            elif r["result"] == "D":
                draws += 1
            else:
                away_wins += 1
            home_goals += r["away_goals"]
            away_goals += r["home_goals"]

    n_a = len(recent)
    return {
        "h2h_home_win_rate":  home_wins / n_a,
        "h2h_draw_rate":      draws / n_a,
        "h2h_away_win_rate":  away_wins / n_a,
        "h2h_matches":        n_a,
        "h2h_home_goals_avg": home_goals / n_a,
        "h2h_away_goals_avg": away_goals / n_a,
    }


# ---------------------------------------------------------------------------
# WORLD CUP HISTORY
# ---------------------------------------------------------------------------

def world_cup_history(df, team, before_date):
    mask = (
        ((df["home_team"] == team) | (df["away_team"] == team))
        & (df["date"] < before_date)
    )
    history = df[mask]

    if history.empty:
        return {
            "wc_total_matches":    0,
            "wc_win_rate":         0.0,
            "wc_goals_scored_avg": 0.0,
            "wc_finals_reached":   0,
        }

    total = len(history)
    wins = 0
    goals_scored = 0.0
    finals = 0

    for _, r in history.iterrows():
        if r["home_team"] == team:
            goals_scored += r["home_goals"]
            if r["result"] == "H":
                wins += 1
        else:
            goals_scored += r["away_goals"]
            if r["result"] == "A":
                wins += 1

        stage_str = str(r.get("stage", "")).lower()
        if "final" in stage_str and "semi" not in stage_str and "quarter" not in stage_str:
            finals += 1

    return {
        "wc_total_matches":    total,
        "wc_win_rate":         wins / total,
        "wc_goals_scored_avg": goals_scored / total,
        "wc_finals_reached":   finals,
    }


# ---------------------------------------------------------------------------
# MASTER FEATURE BUILDER
# ---------------------------------------------------------------------------

def build_match_features(
    df,
    home_team,
    away_team,
    match_date,
    elos,
    home_odds=0,
    draw_odds=0,
    away_odds=0,
    stage="group stage",
):
    features = {}

    # ELO
    elo_h = elos.get(home_team, INITIAL_ELO)
    elo_a = elos.get(away_team, INITIAL_ELO)
    features["elo_home"]     = elo_h
    features["elo_away"]     = elo_a
    features["elo_diff"]     = elo_h - elo_a
    features["elo_expected"] = expected_score(elo_h, elo_a)

    # Form
    home_form = team_form(df, home_team, match_date, n=10)
    away_form = team_form(df, away_team, match_date, n=10)
    for k, v in home_form.items():
        features[f"home_{k}"] = v
    for k, v in away_form.items():
        features[f"away_{k}"] = v

    # Head to head
    h2h = h2h_features(df, home_team, away_team, match_date, n=8)
    features.update(h2h)

    # World Cup history
    home_wc = world_cup_history(df, home_team, match_date)
    away_wc = world_cup_history(df, away_team, match_date)
    for k, v in home_wc.items():
        features[f"home_{k}"] = v
    for k, v in away_wc.items():
        features[f"away_{k}"] = v

    # Stage weight
    features["stage_weight"] = get_stage_weight(stage)

    # Odds
    if home_odds and draw_odds and away_odds:
        raw = [1/home_odds, 1/draw_odds, 1/away_odds]
        total = sum(raw)
        features["odds_home_prob"] = raw[0] / total
        features["odds_draw_prob"] = raw[1] / total
        features["odds_away_prob"] = raw[2] / total
        features["odds_margin"]    = total - 1
    else:
        features["odds_home_prob"] = 1/3
        features["odds_draw_prob"] = 1/3
        features["odds_away_prob"] = 1/3
        features["odds_margin"]    = 0.0

    # Derived
    features["goal_diff_advantage"] = (
        features["home_form_goal_diff"] - features["away_form_goal_diff"]
    )
    features["wc_experience_gap"] = (
        features["home_wc_total_matches"] - features["away_wc_total_matches"]
    )

    return features
