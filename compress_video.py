import os
import sys
from moviepy.editor import VideoFileClip

input_path = r"c:\Users\Admin\Desktop\Soil\frontend\public\landing_video.mp4"
output_path = r"c:\Users\Admin\Desktop\Soil\frontend\public\landing_video_compressed.mp4"
gitignore_path = r"c:\Users\Admin\Desktop\Soil\frontend\public\.gitignore"

try:
    print("Loading video...")
    clip = VideoFileClip(input_path)
    print(f"Original size: {clip.w}x{clip.h}, Duration: {clip.duration}s")
    
    print("Compressing video... This may take a few minutes.")
    # Use libx264, lower bitrate, remove audio (no resizing to avoid Pillow issues)
    clip.write_videofile(
        output_path, 
        codec="libx264", 
        audio=False, 
        bitrate="800k",
        preset="ultrafast",
        threads=4
    )
    
    clip.close()
    
    print("\nCompression complete!")
    print(f"Original size: {os.path.getsize(input_path) / (1024*1024):.2f} MB")
    print(f"Compressed size: {os.path.getsize(output_path) / (1024*1024):.2f} MB")
    
    # Replace old file
    print("Replacing old file...")
    os.remove(input_path)
    os.rename(output_path, input_path)
    
    # Clear gitignore
    print("Clearing gitignore...")
    with open(gitignore_path, "w") as f:
        f.write("")
        
    print("Done! Ready to push.")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
