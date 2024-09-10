import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Video } from "../models/video.model.js"
import { Class } from "../models/class.model.js"
import { fileUploadCloudinary, deleteFileFromCloudinary } from "../utils/Fileupload.js"

const uploadAVideo = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const { classId } = req.params; 

    if (!description) {
        throw new ApiError(400, "Description is required");
    }

    // Check if video file is provided
    const uploadVideoPath = req.files?.videoFile[0]?.path;
    if (!uploadVideoPath) {
        throw new ApiError(400, "Video file is required");
    }

    // Upload the video file to Cloudinary
    const videoFile = await fileUploadCloudinary(uploadVideoPath);
    if (!videoFile) {
        throw new ApiError(400, "Failed to upload video to cloud");
    }

    // Create a new video record
    const publishVideo = await Video.create({
        description,
        duration: videoFile.duration,
        videoFile: videoFile.url
    });

    // Update the class with the new video ID
    const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $push: { classes: publishVideo._id } }, // Assuming you have a videos field in the Class schema
        { new: true, useFindAndModify: false }
    );

    if (!updatedClass) {
        throw new ApiError(404, "Class not found");
    }

    return res.status(200).json(
        new ApiResponse(200, publishVideo, "Video uploaded and class updated successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { description } = req.body;

    // Find and update the video
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { description },
        { new: true, runValidators: true }
    );

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
});

const getVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Find the video by its ID
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video retrieved successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { classId } = req.query;


    const deletedVideo = await Video.findByIdAndDelete(videoId);
    console.log("Deleted Video:", deletedVideo); // Check if the video is found and deleted

    if (!deletedVideo) {
        console.log("Video not found with ID:", videoId);
        throw new ApiError(404, "Video not found");
    }

    // Update the class document to remove the video reference
    const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $pull: { classes: videoId } }, 
        { new: true, useFindAndModify: false }
    );
    if (!updatedClass) {
        throw new ApiError(404, "Class not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { classId } = req.query; // Optional: You can filter by class if a classId is provided

        let videos;

        if (classId) {
            // If classId is provided, find videos related to that class
            const classWithVideos = await Class.findById(classId).populate('classes');
            if (!classWithVideos) {
                throw new ApiError(404, "Class not found");
            }
            videos = classWithVideos.classes; // Assuming 'classes' is the field containing video references
        } else {
            // Fetch all videos if no classId is provided
            videos = await Video.find();
        }

        return res.status(200).json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while fetching videos");
    }
});


export{
    uploadAVideo,
    updateVideo,
    getVideo,
    deleteVideo,
    getAllVideos
}