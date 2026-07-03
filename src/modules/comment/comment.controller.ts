import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getAllComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getSingleComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getCommentByAuthorId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  createComment,
  getAllComment,
  getSingleComment,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateComment,
};
