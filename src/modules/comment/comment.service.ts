import { toUSVString } from "node:util";
import { prisma } from "../../lib/prisma";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";

const createCommentIntoDB = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return comment;
};

const getCommentByAuthorId = async (authorId: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return comments;
};

const getSingleCommentFromDB = async (commentId: string) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });

  return comment;
};

const updateCommentIntoDB = async (
  commentId: string,
  payload: IUpdateCommentPayload,
  authorId: string,
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  const uddatedComment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
  });

  return uddatedComment;
};

const deleteComentFromDB = async (commentId: string, authorId: string) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  await prisma.comment.delete({
    where: {
      id: commentId,
      authorId,
    },
  });
};

const moderateCommentIntoDB = async (
  commentId: string,
  payload: IUpdateCommentPayload,
) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  const moderatedComment = prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
  });

  return moderatedComment;
};

export const commentService = {
  createCommentIntoDB,
  getCommentByAuthorId,
  getSingleCommentFromDB,
  updateCommentIntoDB,
  deleteComentFromDB,
  moderateCommentIntoDB,
};
