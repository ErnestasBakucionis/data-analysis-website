'use-client';
import React from 'react';
import AnimatedButton from './AnimatedButton';

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    return (
        <div className="pagination flex justify-center items-center space-x-2 my-4">
            {Array.from({ length: totalPages }, (_, index) => (
                <AnimatedButton
                    key={index}
                    className={`px-4 py-2 text-sm border rounded-md ${currentPage === index + 1
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-white text-green-500 border-gray-300 hover:bg-blue-100'
                        }`}
                    onClick={() => onPageChange(index + 1)}
                    disabled={currentPage === index + 1}
                >
                    {index + 1}
                </AnimatedButton>
            ))}
        </div>
    );
};

export default Pagination;
