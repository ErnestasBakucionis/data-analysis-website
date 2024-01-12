import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import useTranslation from '@/utils/useTranslation';
import AnimatedButton from './AnimatedButton';

type SearchBarProps = {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRefresh: () => void;
    placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    onRefresh,
    placeholder = "Search..."
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex justify-between items-center mb-4">
            <label className="block text-gray-700 font-bold m-2">
                {t('search')}
            </label>
            <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder={placeholder}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex-grow"
            />
            <AnimatedButton
                onClick={onRefresh}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
                <FontAwesomeIcon icon={faSync} />
            </AnimatedButton>
        </div>
    );
};

export default SearchBar;
