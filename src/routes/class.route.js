import { Router } from "express";
import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from "../controllers/class.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/createClass').post(
    upload.fields([
        {
            name: "picture",
            maxCount: 1,
        }
    ]),
    createClass);
router.route('/').get(getAllClasses);
router.route('/:classId').get(getClassById);
router.route('/updateClass/:classId').patch(
    upload.fields([
        {
            name: "picture",
            maxCount: 1,
        }
    ]),
    updateClass);
router.route('/deleteClass/:classId').delete(deleteClass);

export default router
