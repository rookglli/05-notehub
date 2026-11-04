import { useState } from 'react';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';

import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes, createNote, deleteNote } from '../../services/noteService';

import type { CreateNoteParams } from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';

import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      setPage(1);
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateNote = async (values: CreateNoteParams) => {
    await createMutation.mutateAsync(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button type="button" className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isFetching && !isLoading && <p>Updating notes...</p>}

      {isError && <p role="alert">Something went wrong. Please try again.</p>}

      {deleteMutation.isError && (
        <p role="alert">Failed to delete note. Please try again.</p>
      )}

      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={handleDeleteNote}
          deletingNoteId={
            deleteMutation.isPending ? deleteMutation.variables : null
          }
        />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onCreate={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
