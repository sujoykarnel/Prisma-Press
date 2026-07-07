import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/:postId", commentController.getCommentByPostId);
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.post(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.createComment,
);
router.patch(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.updateComment,
);
router.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.deleteComment,
);

router.put("/:commentId/moderate", commentController.moderateComment);

export const commentRouter = router;
