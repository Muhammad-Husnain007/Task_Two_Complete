import { Router } from "express";
import { deleteVideo, getAllVideos, getVideo, updateVideo, uploadAVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/upload/:classId').post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
    ]),
    uploadAVideo);
router.route('/update/:videoId').patch(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
    ]),
    updateVideo);
router.route('/get/:videoId').get(getVideo);
router.delete('/delete/:videoId', deleteVideo);
router.route('/all').get(getAllVideos);


export default router
