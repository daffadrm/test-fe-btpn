import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const contactApi = createApi({
	reducerPath: 'contactApi',
	baseQuery: fetchBaseQuery({
		baseUrl: 'https://contact.herokuapp.com/',
	}),
	tagTypes: ['contact'],
	endpoints: (builder) => ({
		getContact: builder.query({
			query: () => `contact`,
			invalidatesTags: ['contact'],
		}),
		getTodoDetails: builder.query({
			query: (id) => `/contact/${id}`,
		}),
		updateContact: builder.mutation({
			query: ({ body, id }) => ({
				url: `contact/${id}`,
				method: 'PUT',
				body,
				invalidatesTags: ['contact'],
			}),
		}),
		createContact: builder.mutation({
			query: ({ body }) => ({
				url: `contact`,
				method: 'POST',
				body,
				invalidatesTags: ['contact'],
			}),
		}),
		deleteContact: builder.mutation({
			query: (id) => ({
				url: `contact/${id}`,
				method: 'DELETE',
				invalidatesTags: ['contact'],
			}),
		}),
	}),
});
export const {
	useGetContactQuery,
	useGetTodoDetailsQuery,
	useUpdateContactMutation,
	useCreateContactMutation,
	useDeleteContactMutation,
} = contactApi;
