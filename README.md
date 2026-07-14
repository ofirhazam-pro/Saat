# Synagogue Donations App

This app is ready to host on Cloudflare Pages as a static site.

## What changed
- The main app remains in [index.html](index.html)
- A Cloudflare Pages Function was added at [api/data.js](api/data.js)
- The app now includes buttons to save and load data from Cloudflare

## Cloudflare deployment steps
1. Create a new Cloudflare Pages project and connect this repository.
2. Set the build output directory to the project root (the folder containing [index.html](index.html)).
3. Create a KV namespace in Cloudflare and bind it as `DATA` in the Pages project.
4. Deploy.

## How it works
- The page saves data locally in browser storage as before.
- It also sends the JSON to the Cloudflare function at `/api/data`.
- The function stores the data in KV under the `default` key.

## Usage
- Use the new “שמור ענן” button to save to Cloudflare.
- Use the new “טען ענן” button to load from Cloudflare.
