#!/usr/bin/env python3
"""Simple test for Bazi calculation"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from backend.main import compute_year_pillar, compute_month_pillar, compute_day_pillar, compute_hour_pillar

# Test basic calculations
print("Testing Bazi calculations...")

# Test year pillar
year_pillar = compute_year_pillar(1990)
print(f"Year 1990: {year_pillar.stem}{year_pillar.branch} ({year_pillar.element}, {year_pillar.animal})")

# Test month pillar
month_pillar = compute_month_pillar(year_pillar.stem, 1)
print(f"Month 1: {month_pillar.stem}{month_pillar.branch} ({month_pillar.element})")

# Test day pillar
day_pillar = compute_day_pillar(1990, 1, 1)
print(f"Day 1990-01-01: {day_pillar.stem}{day_pillar.branch} ({day_pillar.element})")

# Test hour pillar
hour_pillar = compute_hour_pillar(day_pillar.stem, 12)
print(f"Hour 12: {hour_pillar.stem}{hour_pillar.branch} ({hour_pillar.element})")

print("\nAll calculations completed successfully!")

