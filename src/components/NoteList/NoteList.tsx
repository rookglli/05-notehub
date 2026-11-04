import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteNote } from '../../services/noteService';

import type { Note } from '../../types/note';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <>
      {deleteMutation.isError && (
        <p role="alert">Failed to delete note. Please try again.</p>
      )}

      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <button
                type="button"
                className={css.button}
                onClick={() => handleDelete(note.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending &&
                deleteMutation.variables === note.id
                  ? 'Deleting...'
                  : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
