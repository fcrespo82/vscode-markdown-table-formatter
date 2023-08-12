#!/usr/bin/env python3
"""
usage:
    ./publish [options]

options:
    --run
"""
import os
import json
import argparse
import keepachangelog
package = json.load(open("package.json"))

options = {"M": "major", "I": "minor",
           "P": "patch", "G": "git push", "C": "cancel"}

parser = argparse.ArgumentParser()
parser.add_argument("--run", action="store_true")

args = parser.parse_args()

def parse_version(version):
    return version.split(".")

data = keepachangelog.to_dict("CHANGELOG.md").keys()

versions_list = list(data)
versions_list.sort()

latest_changelog_version = versions_list[-1]

if not args.run:
    print("Running in DRY RUN mode")

print("Current", package["name"], "package version:", package["version"], "\n")
while (True):
    option = input(
        "Publish [m]ajor, m[i]nor, [p]atch, just push to [g]it, [C]ancel? ").upper()
    if option == "" or option == "C":
        exit(0)
    if option in options.keys():
        break

echo = "echo " if not args.run else ""
if option != "G":
    parsed_version = parse_version(package["version"])
    new_version = ""
    if option == "M":
        new_version = f"{int(parsed_version[0]) + 1}.0.0"
    elif option == "I":
        new_version = f"{int(parsed_version[0])}.{int(parsed_version[1]) + 1}.0"
    elif option == "P":
        new_version = f"{int(parsed_version[0])}.{int(parsed_version[1])}.{int(parsed_version[2]) + 1}"

    if new_version != latest_changelog_version:
        print("There isn't a changelog for this release. ABORTING")
        print(f"New version:\t\t{new_version}")
        print(f"Latest changelog:\t{latest_changelog_version}")
        exit(1)
    publish = input(
        f"New version will be: {new_version}, continue? [Y/n] ").upper()
    if publish == "N":
        exit(0)
    os.system(f"{echo}vsce publish --yarn {options[option]}")
os.system(f"{echo}git push")
os.system(f"{echo}git push --tags")
