import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (
  payload: ICreatePostPayload,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};
const getAllPostFromDB = async () => {
  const posts = prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostStats = async () => {};

const getMyPost = async (authorId: string) => {
  const myPosts = prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return myPosts;
};

const getSinglePostFromDB = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatedPost;
};

const updatePostIntoDB = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not woner of the post");
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
  });

  return updatedPost;
};

const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not woner of the post");
  }

   await prisma.post.delete({
    where: {
      id: postId,
    },
  });


};

export const postService = {
  createPostIntoDB,
  getAllPostFromDB,
  getSinglePostFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  getPostStats,
  getMyPost,
};
