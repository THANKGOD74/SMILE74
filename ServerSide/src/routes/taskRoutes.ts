import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask, getTrashedTasks, restoreTask, permanentDeleteTask, } from "../controllers/taskControllers";
import { protect } from '../middleWare/auth';


const router = Router();
router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Trash routes
router.get('/trash', getTrashedTasks);
router.put('/:id/restore', restoreTask);
router.delete('/:id/permanent', permanentDeleteTask);


export default router;