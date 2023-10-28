import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseURI = 'http://localhost:8080'

export const apiSlice = createApi({
    baseQuery : fetchBaseQuery({
        baseUrl : baseURI 
    }),
    endpoints : builder => ({
        // get categories
        getCategories: builder.query({
            // get : 'http://localhost:8080/api/categories'
            query: () => '/api/categories',
            providesTags: ['categories']
        }),

        // get labels
        getLabels : builder.query({
            query: () => '/api/labels',
            providesTags: ['transactions']
        }),

        // add new Transactions 
        addTrnsaction : builder.mutation({
            query : (initialTransaction) => ({
                // post : 'http://localhost:8080/api/transaction'
                url : '/api/transaction',
                method : "POST",
                body : initialTransaction
            }),
            invalidatesTags: ['transactions']
        }),

        // delete record
        deleteTransaction : builder.mutation({
            query : recordid => ({
                // delete : 'http://localhost:8080/api/transaction'
                url : '/api/transaction',
                method : "DELETE",
                body : recordid  
            }),
            invalidatesTags: ['transactions']
        })

    })
})

export default apiSlice;