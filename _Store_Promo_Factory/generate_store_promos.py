"""
Evermark Prints — Autonomous RTX 5060 Short-Form Promo Factory
Renders 1080x1920 (9:16 vertical) TikTok & YouTube Shorts videos showcasing
Evermark Prints' mathematical Star Maps, Voice Waveforms, and Pet Keepsakes
using hardware-accelerated NVIDIA h264_nvenc.
"""

import os
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

EVERMARK_DIR = r"C:\Users\ryanb\OneDrive\Documents\Digital Dads\EvermarkPrints"
AUDIO_DIR = r"C:\Users\ryanb\OneDrive\Documents\Digital Dads\public\games\orbital-drift\audio"
OUT_DIR = os.path.join(EVERMARK_DIR, "_Store_Promo_Factory", "output_shorts")
FRAMES_DIR = os.path.join(EVERMARK_DIR, "_Store_Promo_Factory", "temp_frames")

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(FRAMES_DIR, exist_ok=True)


def load_font(size, bold=False, serif=False):
    candidates = []
    if serif:
        candidates = [
            r"C:\Windows\Fonts\georgiab.ttf" if bold else r"C:\Windows\Fonts\georgia.ttf",
            r"C:\Windows\Fonts\timesbd.ttf" if bold else r"C:\Windows\Fonts\times.ttf",
        ]
    else:
        candidates = [
            r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_framed_print_preview(canvas, mode, headline, subline, loc_date, coords):
    d = ImageDraw.Draw(canvas)
    # Wood frame around print (centered at y=460..1240)
    fx1, fy1, fx2, fy2 = 160, 440, 920, 1260
    d.rounded_rectangle([fx1 - 16, fy1 - 16, fx2 + 16, fy2 + 16], radius=8, fill=(36, 28, 24), outline=(68, 53, 45), width=4)
    d.rectangle([fx1, fy1, fx2, fy2], fill=(10, 16, 29), outline=(229, 184, 105), width=2)
    d.rectangle([fx1 + 18, fy1 + 18, fx2 - 18, fy2 - 18], outline=(229, 184, 105), width=1)

    cx, cy, R = 540, 740, 210
    if mode == "starmap":
        d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=(229, 184, 105), width=3)
        d.ellipse([cx - R + 12, cy - R + 12, cx + R - 12, cy + R - 12], outline=(148, 163, 184), width=1)
        pts = [
            (cx - 110, cy - 80),
            (cx - 55, cy - 35),
            (cx - 10, cy - 60),
            (cx + 45, cy - 15),
            (cx + 115, cy - 55),
            (cx + 80, cy + 50),
            (cx - 30, cy + 75),
            (cx - 95, cy + 30),
        ]
        for i in range(len(pts) - 1):
            d.line([pts[i], pts[i + 1]], fill=(229, 184, 105), width=2)
        for px, py in pts:
            d.ellipse([px - 5, py - 5, px + 5, py + 5], fill=(254, 240, 138))
    elif mode == "soundwave":
        d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=(229, 184, 105), width=2)
        for i in range(64):
            x = (cx - 185) + i * 5.8
            env = math.sin((i / 64.0) * math.pi)
            amp = max(6, int(env * (40 + (i * 19 % 95))))
            col = (229, 184, 105) if i % 4 == 0 else (247, 244, 239)
            d.line([(x, cy - amp), (x, cy + amp)], fill=col, width=3)
    else:
        for ring in range(1, 6):
            rx = int((R / 5) * ring)
            ry = int(rx * 0.84)
            d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=(229, 184, 105), width=2 if ring == 5 else 1)
        d.line([(cx - R - 15, cy), (cx + R + 15, cy)], fill=(229, 184, 105), width=1)
        d.line([(cx, cy - R - 15), (cx, cy + R + 15)], fill=(229, 184, 105), width=1)

    # Typography inside frame
    d.line([(cx - 100, 1000), (cx + 100, 1000)], fill=(229, 184, 105), width=2)
    d.text((cx - 190, 1022), headline, fill=(247, 244, 239), font=load_font(24, bold=True, serif=True))
    d.text((cx - 210, 1062), subline, fill=(203, 213, 225), font=load_font(17, serif=True))
    d.text((cx - 175, 1105), loc_date, fill=(229, 184, 105), font=load_font(16, bold=True))
    d.text((cx - 115, 1140), coords, fill=(148, 163, 184), font=load_font(15))
    d.text((cx - 155, 1195), "EVERMARK ARCHIVAL STUDIO • 300 DPI", fill=(100, 116, 139), font=load_font(12, bold=True))


CAMPAIGNS = [
    {
        "id": "evermark_01_night_sky_starmap",
        "mode": "starmap",
        "audio": "level_1_solar_jetstream.mp3",
        "hook": "TYPE THE MINUTE YOUR CHILD WAS BORN",
        "title": "Watch Your Exact Night Sky\nMap Itself in Real Time",
        "print_headline": "THE NIGHT OUR STORY BEGAN",
        "print_sub": "Underneath these exact stars, everything changed.",
        "print_loc": "CHARLESTON, SC  •  OCT 14, 2022",
        "print_coords": "32.7765° N, 79.9311° W",
        "bullets": [
            "✓ Real Astronomical Star & Constellation Math",
            "✓ Solid-Wood Framed Canvas Shipped Free (US)",
            "✓ Save $29 on the 2-Print Heirloom Gift Set",
        ],
    },
    {
        "id": "evermark_02_voice_soundwave",
        "mode": "soundwave",
        "audio": "level_2_magnetar_pulsar.mp3",
        "hook": "DON'T LET OLD VOICEMAILS DISAPPEAR",
        "title": "Turn a Loved One's Voice or\nWedding Song Into Framed Art",
        "print_headline": "ALWAYS IN OUR HEARTS",
        "print_sub": "“I love you to the moon and back” · Voice Note",
        "print_loc": "ARCHIVAL HARMONIC PROFILE • 44.1 KHZ",
        "print_coords": "00:00 ————————●———— 00:18",
        "bullets": [
            "✓ Live Real-Time Preview Before You Order",
            "✓ Museum-Grade Archival Canvas + Wood Frame",
            "✓ Ships in 3–5 Days Across the USA",
        ],
    },
    {
        "id": "evermark_03_home_coordinates",
        "mode": "coordinates",
        "audio": "level_3_wormhole_bridge.mp3",
        "hook": "THE #1 NEW HOME & ANNIVERSARY GIFT",
        "title": "Custom Latitude & Hometown\nCoordinate Archival Print",
        "print_headline": "OUR FIRST FAMILY HOME",
        "print_sub": "Where loud mornings & lifelong memories are made.",
        "print_loc": "PROVIDENCE, RI  •  EST. 2026",
        "print_coords": "41.8240° N · 71.4128° W",
        "bullets": [
            "✓ 4 Timeless Palettes (Linen, Midnight Gold, Slate)",
            "✓ $79 Framed (Free US Ship) or $29 Instant Digital",
            "✓ Personalize Yours Live at EvermarkPrints.com",
        ],
    },
]


def build_videos():
    w, h = 1080, 1920
    for camp in CAMPAIGNS:
        canvas = Image.new("RGB", (w, h), (7, 10, 18))
        d = ImageDraw.Draw(canvas)

        # Hook pill
        d.rounded_rectangle([65, 115, w - 65, 215], radius=18, fill=(229, 184, 105))
        d.text((100, 145), camp["hook"], fill=(9, 13, 22), font=load_font(36, bold=True))

        # Main Title
        d.multiline_text(
            (75, 250),
            camp["title"],
            fill=(247, 244, 239),
            font=load_font(50, bold=True, serif=True),
            spacing=12,
        )

        # Framed Print Preview
        draw_framed_print_preview(
            canvas,
            camp["mode"],
            camp["print_headline"],
            camp["print_sub"],
            camp["print_loc"],
            camp["print_coords"],
        )

        # Bullets
        for idx, b in enumerate(camp["bullets"]):
            d.text((80, 1330 + idx * 68), b, fill=(226, 232, 240), font=load_font(32, bold=True))

        # Bottom CTA
        d.rounded_rectangle([65, 1590, w - 65, 1730], radius=22, fill=(18, 27, 45), outline=(229, 184, 105), width=3)
        d.text(
            (115, 1636),
            "Personalize Live at EvermarkPrints.com →",
            fill=(229, 184, 105),
            font=load_font(36, bold=True),
        )

        frame_png = os.path.join(FRAMES_DIR, f"{camp['id']}.png")
        canvas.save(frame_png, "PNG")

        audio_path = os.path.join(AUDIO_DIR, camp["audio"])
        out_mp4 = os.path.join(OUT_DIR, f"{camp['id']}.mp4")

        cmd = [
            "ffmpeg",
            "-y",
            "-loop",
            "1",
            "-i",
            frame_png,
            "-i",
            audio_path,
            "-t",
            "18",
            "-vf",
            "scale=1080:1920,format=yuv420p",
            "-c:v",
            "h264_nvenc",
            "-preset",
            "p6",
            "-b:v",
            "8M",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            out_mp4,
        ]
        subprocess.run(cmd, check=True)
        print(f"Rendered Evermark GPU Short: {out_mp4}")


if __name__ == "__main__":
    build_videos()
