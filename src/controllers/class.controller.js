import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { Class } from "../models/class.model.js"
import {fileUploadCloudinary, deleteFileFromCloudinary} from "../utils/Fileupload.js"

// create class

const createClass = asyncHandler(async(req,res) => {
    try {
        const {description, title} = req.body;
        if (
            [description, title].some((fields) => fields?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        const checkClassIsAlredyExist = await Class.findOne({
            $or: [{ title }]
        })
        if (checkClassIsAlredyExist) {
            throw new ApiError(409, "This title class already exists")
        }
    
        const pictureLocalPath = req.files?.picture?.[0]?.path;

    if (!pictureLocalPath) {
        throw new ApiError(400, "Picture is required")
    }
    const picture = await fileUploadCloudinary(pictureLocalPath);
    if (!picture) {
        throw new ApiError(400, "picture is required for cloud")
    }

    const newClass = await Class.create({
        description,
        title,
        picture: picture.url,
    })

    return res.status(200).json(
        new ApiResponse(200, newClass, "Class created Successfully")
    )

    } catch (error) {
        throw new ApiError(500, error?.message, "Some thing went wrong")
    }
});

// get All classes
const getAllClasses = asyncHandler(async(req,res) => {
    try {
        const classes = await Class.find(req.user)
        return res.status(200)
            .json(new ApiResponse(
                200,
                classes,
                "User Get Successfully"
            ));
    } catch (error) {
        throw new ApiError(500, error?.messege, "Error in Users Fetched from Server")
    }
});

// get by id classs
const getClassById = asyncHandler(async(req,res) => {
    try {
       const {classId} = req.params;
       const singleClass = await Class.findById(classId) 
       if (!singleClass) {
        throw new ApiError(409, "Class not found")
    }
    return res.status(200).json(
        new ApiResponse(200, singleClass, "Class created Successfully")
    )
    } catch (error) {
        throw new ApiError(500, error?.message, "Some thing went wrong")
        
    }
});

// update class
const updateClass = asyncHandler(async(req,res) => {
    try {
        const {description, title} = req.body;
        const {classId} = req.params;
        const update = await Class.findByIdAndUpdate(
            classId,
           { $set:{
                description,
                title
            }
        },
        {new: true}
        ) 
        if(!update){
        throw new ApiError(400, "Error in update class")
        }
    return res.status(200).json(
        new ApiResponse(200, update, "Class created Successfully")
    )
    } catch (error) {
        throw new ApiError(400, error?.message, "Some thing went wrong")
    }
});

// delete class
const deleteClass = asyncHandler(async(req,res) => {
    try {
        const {classId} = req.params;
        const deleteClass = await Class.findByIdAndDelete(classId)
        return res.status(200).json(
            new ApiResponse(200, {}, "Class deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(400, error?.message, "Some thing went wrong")
        
    }
});

export{
    createClass,
    deleteClass,
    updateClass,
    getClassById,
    getAllClasses,
}