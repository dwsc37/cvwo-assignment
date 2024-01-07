import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Credentials, Message } from '../interfaces/interaces';


const baseUrl = "http://localhost:8000/api"

export const api = createApi({
    tagTypes: ["AUTH"],
    baseQuery: fetchBaseQuery({
        baseUrl,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            headers.set('Content-Type', 'application/json'); // Set default Content-Type to JSON
            return headers;
        },
    }),
    endpoints: (builder) => ({
        //AUTH routes
        register: builder.mutation<Message, Credentials>({
            query: (user) => ({
                url: "register",
                method: "POST",
                body: user,
            })
        }),
        login: builder.mutation<Message, Credentials>({
            query: (user) => ({
                url: "login",
                method: "POST",
                body: user,
            }),
            invalidatesTags: (result, error) => error ? [] : ["AUTH"],
        }),
        validate: builder.query<Message, void>({
            query: () => ({
                url: "/validate",
            }),
            providesTags: ["AUTH"],
        }),
        
        //POSTS routes
        getAllPosts: builder.query({
            query: () => ({
                url: "posts/all"
            })
        }),

        //LOGOUT
        logout: builder.mutation<Message, void>({
            query: () => ({
                url: "logout",
                method: "POST"
            }),
            invalidatesTags: ["AUTH"],
        })
    })
})

export const { useRegisterMutation, useLoginMutation, useValidateQuery, useGetAllPostsQuery, useLogoutMutation} = api

