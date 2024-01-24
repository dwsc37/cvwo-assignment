import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    CommentDetailed,
    Credentials,
    Message,
    ModuleDetailed,
    Post,
    PostDetailed,
    Tag,
    UserInfo,
} from "../interfaces/interfaces";
import { Module } from "../interfaces/interfaces";

const baseUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080/api"
        : "/api";

export const api = createApi({
    tagTypes: ["USER", "MODULES", "MODULE", "POST", "COMMENTS", "FEED"],
    baseQuery: fetchBaseQuery({
        baseUrl,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            headers.set("Content-Type", "application/json"); // Set default Content-Type to JSON
            return headers;
        },
    }),
    keepUnusedDataFor: 600,
    endpoints: (builder) => ({
        //AUTH routes
        register: builder.mutation<Message, Credentials>({
            query: (user) => ({
                url: "register",
                method: "POST",
                body: user,
            }),
        }),
        login: builder.mutation<Message, Credentials>({
            query: (user) => ({
                url: "login",
                method: "POST",
                body: user,
            }),
            invalidatesTags: ["USER"],
        }),
        validate: builder.query<Message, void | string>({
            query: () => ({
                url: "validate",
            }),
            keepUnusedDataFor: 0,
            providesTags: ["USER"],
        }),

        //MODULE routes
        getAllModules: builder.query<ModuleDetailed[], void>({
            query: () => ({
                url: "modules/all",
            }),
            providesTags: ["MODULES"],
        }),

        getModule: builder.query<ModuleDetailed, string>({
            query: (moduleCode) => ({
                url: "module/" + moduleCode,
            }),
            providesTags: (result, error, arg) => [{ type: "MODULE", id: arg }],
        }),

        getModulePosts: builder.query<PostDetailed[], string>({
            query: (moduleCode) => ({
                url: "module/" + moduleCode + "/posts",
            }),
            providesTags: (result, error, arg) => [{ type: "FEED", id: arg }],
        }),

        //TAG routes
        getTags: builder.query<Tag[], void>({
            query: () => ({
                url: "tags",
            }),
        }),

        //POST routes
        createPost: builder.mutation<Message, Post>({
            query: (post) => ({
                url: "posts/create",
                method: "POST",
                body: post,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "FEED", id: arg.ModuleCode },
                { type: "FEED", id: "All" },
            ],
        }),
        likePost: builder.mutation<Message, PostDetailed>({
            query: (post) => ({
                url: "posts/like/" + post.ID,
                method: "PUT",
                body: post,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "FEED", id: arg.ModuleCode },
                { type: "POST", id: arg.ID },
                { type: "FEED", id: "All" },
            ],
        }),
        unlikePost: builder.mutation<Message, PostDetailed>({
            query: (post) => ({
                url: "posts/unlike/" + post.ID,
                method: "PUT",
                body: post,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "FEED", id: arg.ModuleCode },
                { type: "POST", id: arg.ID },
                { type: "FEED", id: "All" },
            ],
        }),
        editPost: builder.mutation<Message, PostDetailed>({
            query: (post) => ({
                url: "posts/edit/" + post.ID,
                method: "PATCH",
                body: post,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "FEED", id: arg.ModuleCode },
                { type: "POST", id: arg.ID },
                { type: "FEED", id: "All" },
            ],
        }),
        deletePost: builder.mutation<Message, PostDetailed>({
            query: (post) => ({
                url: "posts/delete/" + post.ID,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "FEED", id: arg.ModuleCode },
                { type: "POST", id: arg.ID },
                { type: "FEED", id: "All" },
            ],
        }),
        getPost: builder.query<PostDetailed, number>({
            query: (postID) => ({
                url: "/post/" + postID,
            }),
            providesTags: (result, error, arg) => [{ type: "POST", id: arg }],
        }),
        getPostComments: builder.query<CommentDetailed[], number>({
            query: (postID) => ({
                url: "/post/" + postID + "/comments",
            }),
            providesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg },
            ],
        }),

        //FEEDS routes
        getAllPosts: builder.query<PostDetailed[], void>({
            query: () => ({
                url: "all",
            }),
            providesTags: (result, error, arg) => [{ type: "FEED", id: "All" }],
        }),
        getHomePosts: builder.query<PostDetailed[], void>({
            query: () => ({
                url: "home",
            }),
            providesTags: (result, error, arg) => [
                { type: "FEED", id: "All" },
                { type: "MODULES" },
            ],
        }),
        getProfilePosts: builder.query<PostDetailed[], string>({
            query: (username) => ({
                url: "profile/" + username,
            }),
            providesTags: (result, error, arg) => [{ type: "FEED", id: "All" }],
        }),

        //COMMENTS routes
        createComment: builder.mutation<
            Message,
            { comment: string; postID: number; moduleCode: string }
        >({
            query: ({ comment, postID, moduleCode }) => ({
                url: "/comments/create/" + postID,
                method: "POST",
                body: { Body: comment },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg.postID },
                { type: "FEED", id: arg.moduleCode },
                { type: "POST", id: arg.postID },
                { type: "FEED", id: "All" },
            ],
        }),
        likeComment: builder.mutation<Message, CommentDetailed>({
            query: (comment) => ({
                url: "/comments/like/" + comment.ID,
                method: "PUT",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg.PostID },
            ],
        }),
        unlikeComment: builder.mutation<Message, CommentDetailed>({
            query: (comment) => ({
                url: "/comments/unlike/" + comment.ID,
                method: "PUT",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg.PostID },
            ],
        }),
        editComment: builder.mutation<Message, CommentDetailed>({
            query: (comment) => ({
                url: "/comments/edit/" + comment.ID,
                method: "PATCH",
                body: comment,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg.PostID },
            ],
        }),
        deleteComment: builder.mutation<
            Message,
            { comment: CommentDetailed; moduleCode: string }
        >({
            query: ({ comment, moduleCode }) => ({
                url: "/comments/delete/" + comment.ID,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "COMMENTS", id: arg.comment.PostID },
                { type: "FEED", id: arg.moduleCode },
                { type: "POST", id: arg.comment.PostID },
                { type: "FEED", id: "All" },
            ],
        }),
        //SUBS routes
        getSubs: builder.query<Module[], void>({
            query: () => ({
                url: "subs",
            }),
            providesTags: ["MODULES"],
        }),

        subscribe: builder.mutation<Message, string>({
            query: (moduleCode) => ({
                url: "subs/sub/" + moduleCode,
                method: "PUT",
                body: module,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MODULE", id: arg },
                { type: "MODULES" },
            ],
        }),

        unsubscribe: builder.mutation<Message, string>({
            query: (moduleCode) => ({
                url: "subs/unsub/" + moduleCode,
                method: "PUT",
                body: module,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "MODULE", id: arg },
                { type: "MODULES" },
            ],
        }),

        //USER  routes
        getUserInfo: builder.query<UserInfo, string>({
            query: (username) => ({
                url: "/user/" + username,
            }),
        }),

        //LOGOUT
        logout: builder.mutation<Message, void>({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
            invalidatesTags: ["USER"],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useValidateQuery,
    useGetAllModulesQuery,
    useGetModuleQuery,
    useGetModulePostsQuery,
    useGetTagsQuery,
    useCreatePostMutation,
    useLikePostMutation,
    useUnlikePostMutation,
    useEditPostMutation,
    useDeletePostMutation,
    useGetPostCommentsQuery,
    useCreateCommentMutation,
    useLikeCommentMutation,
    useUnlikeCommentMutation,
    useEditCommentMutation,
    useDeleteCommentMutation,
    useGetPostQuery,
    useGetAllPostsQuery,
    useGetHomePostsQuery,
    useGetProfilePostsQuery,
    useGetSubsQuery,
    useSubscribeMutation,
    useUnsubscribeMutation,
    useGetUserInfoQuery,
    useLogoutMutation,
} = api;
