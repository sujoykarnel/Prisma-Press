import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;

    const result = await postService.createPostIntoDB(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts retrived successfully",
      data: result,
    });
  },
);

const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await postService.getPostStats()

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Stats Retrivied Successfully",
      data: result,
    });
  },
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPost(authorId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Post Retrivied Successfully",
      data: result,
    });
  },
);

const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required In Params");
    }
    const result = await postService.getSinglePostFromDB(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrived Successfully",
      data: result,
    });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post Id Required In Params");
    }
    const payload = req.body;

    const result = await postService.updatePostIntoDB(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: result,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post Id Required In Params");
    }

    await postService.deletePostFromDB(
      postId as string,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Has Been Deleted Successfully",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPost,
  getPostStats,
  getSinglePost,
  updatePost,
  deletePost,
  getMyPosts,
};
