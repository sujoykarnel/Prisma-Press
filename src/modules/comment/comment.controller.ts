import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;

    const result = await commentService.createCommentIntoDB(
      authorId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Created Successfully",
      data: result,
    });
  },
);

const getCommentByPostId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const result = await commentService.getCommentByPostIdFromDB(
      postId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Retrived Successfully",
      data: result,
    });
  },
);

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await commentService.getCommentByAuthorId(
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments Retrived Successfully",
      data: result,
    });
  },
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;
    const authorId = req.user?.id;

    const result = await commentService.updateCommentIntoDB(
      commentId as string,
      payload,
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Updated Successfully",
      data: result,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const authorId = req.user?.id;

    await commentService.deleteComentFromDB(
      commentId as string,
      authorId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Deleted Successfully",
      data: null,
    });
  },
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId;
    const payload = req.body;

    const result = await commentService.moderateCommentIntoDB(
      commentId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Updated Successfully",
      data: result,
    });
  },
);

export const commentController = {
  createComment,
  getCommentByPostId,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment,
};
