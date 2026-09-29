import api from '../api';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchEvents = async ({ pageParam = 0, queryKey }) => {
    const [_key, filters] = queryKey;
    try {
        const params = {
            limit: 10,
            offset: pageParam,
            ...filters
        };

        // Format array parameters into comma-separated strings for URL clean matching
        if (Array.isArray(params.services) && params.services.length > 0) {
            params.services = params.services.join(',');
        } else if (Array.isArray(params.services)) {
            delete params.services;
        }

        if (Array.isArray(params.environments) && params.environments.length > 0) {
            params.environments = params.environments.join(',');
        } else if (Array.isArray(params.environments)) {
            delete params.environments;
        }

        // Omit empty string filter parameters
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === undefined || params[key] === null) {
                delete params[key];
            }
        });

        const response = await api.get('/change-events', { params });
        if (response.data.success) {
            return {
                data: response.data.data,
                pagination: response.data.pagination
            };
        } else {
            throw new Error('API reported failure');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch events');
    }
};

export const useEvents = (filters = {}) => {
    return useInfiniteQuery({
        queryKey: ['events', filters],
        queryFn: fetchEvents,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.pagination) return undefined;
            const limit = lastPage.pagination.limit || 10;
            const currentOffset = lastPage.pagination.offset || 0;
            const total = lastPage.pagination.total;
            const nextOffset = currentOffset + limit;
            
            return nextOffset < total ? nextOffset : undefined;
        },
    });
};
