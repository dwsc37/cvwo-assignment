import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Credentials, Message, Module, ModuleDetailed, ModuleListResponse } from '../interfaces/interaces';


const baseUrl = "http://localhost:8000/api"

export const api = createApi({
    tagTypes: ["USER", "SUBS"], 
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
            invalidatesTags: ["USER"],
        }),
        validate: builder.query<Message, void>({
            query: () => ({
                url: "validate",
            }),
            providesTags: ["USER"],
        }),
        
        //USER routes
        getUser: builder.query({
            query: () => ({
                url: "user",
            }),
            providesTags: ["USER"],
        }),

        //MODULE routes
        getAllModules: builder.query<ModuleDetailed[], void>({
            query: () => ({
                url: "modules/all",
            }),
            transformResponse: (data: ModuleListResponse) => data.modules as ModuleDetailed[],
            providesTags: ["SUBS"],
        }),

        //SUBS routes
        getSubs: builder.query<Module[],void>({
            query: () => ({
                url: "subs"
            }),
            transformResponse: (data : ModuleListResponse) => data.modules,
            providesTags: ["USER","SUBS"],
        }),

        subscribe: builder.mutation<Message, string>({
            query: (moduleCode) => ({
                url: "subs/sub/"+moduleCode,
                method: "PUT",
            }),
            invalidatesTags: ["SUBS"],
        }),

        unsubscribe: builder.mutation<Message, string>({
            query: (moduleCode) => ({
                url: "subs/unsub/"+moduleCode,
                method: "PUT",
            }),
            invalidatesTags: ["SUBS"],
        }),

        //LOGOUT
        logout: builder.mutation<Message, void>({
            query: () => ({
                url: "logout",
                method: "POST"
            }),
            invalidatesTags: ["USER"],
        })
    })
})

export const { useRegisterMutation, useLoginMutation, useValidateQuery, 
               useGetAllModulesQuery,
               useGetSubsQuery, useSubscribeMutation, useUnsubscribeMutation,
               useLogoutMutation} = api

