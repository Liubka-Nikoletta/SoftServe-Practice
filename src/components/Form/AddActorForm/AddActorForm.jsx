import React, { useState, useEffect } from 'react';
import FormField from '../FormField/FormField';
import FormSubmit from '../FormSubmit/FormSubmit';
import './AddActorForm.css';

const AddActorForm = ({ isOpen, mode, initialMovieId, initialActorData, onClose }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [role, setRole] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentMovieId, setCurrentMovieId] = useState(null); 
  const [editingActor, setEditingActor] = useState(null);   

  useEffect(() => {
    if (isOpen) {
      if (mode === 'addActor' && initialMovieId) {
        setCurrentMovieId(initialMovieId);
        setEditingActor(null);
        setName('');
        setSurname('');
        setRole('');
        setPhotoUrl('');
        setErrors({});
        setIsSubmitting(false);
      } else if (mode === 'editActor' && initialActorData) {
        setEditingActor(initialActorData);
        setCurrentMovieId(null); 
        setName(initialActorData.name || '');
        setSurname(initialActorData.surname || '');
        setRole(initialActorData.role || '');
        setPhotoUrl(initialActorData.photo || '');
        setErrors({});
        setIsSubmitting(false);
      } else {
        setCurrentMovieId(null);
        setEditingActor(null);
      }
    } else {
      setCurrentMovieId(null);
      setEditingActor(null);
    }
  }, [isOpen, mode, initialMovieId, initialActorData]);

  const shouldShowAddActorMode = isOpen && mode === 'addActor' && currentMovieId;
  const shouldShowEditActorMode = isOpen && mode === 'editActor' && editingActor;

  if (!shouldShowAddActorMode && !shouldShowEditActorMode) {
    return null; 
  }

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!surname.trim()) newErrors.surname = 'Surname is required.';
    if (!role.trim()) newErrors.role = 'Role is required.';
    if (photoUrl.trim() && !photoUrl.startsWith('http') && !photoUrl.startsWith('src/assets/')) {
      newErrors.photoUrl = 'Please enter a valid URL or a relative path like src/assets/...';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    if ((mode === 'addActor' && !currentMovieId) || (mode === 'editActor' && (!editingActor || !editingActor.id))) {
        console.error("Context missing for form submission (movieId or editingActor.id).");
        setErrors({ form: 'An error occurred. Please try again.'})
        return;
    }

    setIsSubmitting(true);

    try {
      const allActorsString = localStorage.getItem('allActors') || '[]';
      let allActors = JSON.parse(allActorsString);

      if (mode === 'addActor') {
        const newActorId = `actor-${Date.now()}`;
        const newActor = {
          id: newActorId,
          name: name.trim(),
          surname: surname.trim(),
          role: role.trim(),
          photo: photoUrl.trim() || 'src/assets/actors/default-actor.png',
        };
        allActors.push(newActor);

        let movieActuallyUpdatedInStorage = false;
        const updateMovieInStorage = (storageKey) => {
          const moviesString = localStorage.getItem(storageKey);
          if (moviesString) {
            let movies = JSON.parse(moviesString);
            const movieIndex = movies.findIndex(m => m.id === currentMovieId);
            if (movieIndex !== -1) {
              if (!movies[movieIndex].actors) movies[movieIndex].actors = [];
              movies[movieIndex].actors.push(newActorId);
              localStorage.setItem(storageKey, JSON.stringify(movies));
              movieActuallyUpdatedInStorage = true;
              return true;
            }
          }
          return false;
        };
        if (!updateMovieInStorage('currentlyPlaying')) updateMovieInStorage('comingSoon');
        if (!movieActuallyUpdatedInStorage) console.warn(`Movie with ID "${currentMovieId}" not found to link new actor.`);

      } else if (mode === 'editActor') {
        allActors = allActors.map(actor => {
          if (actor.id === editingActor.id) {
            return {
              ...actor,
              name: name.trim(),
              surname: surname.trim(),
              role: role.trim(),
              photo: photoUrl.trim() || 'src/assets/actors/default-actor.png',
            };
          }
          return actor;
        });
      }

      localStorage.setItem('allActors', JSON.stringify(allActors));
      document.dispatchEvent(new CustomEvent('actorsUpdated'));
      console.log(`Actor ${mode === 'editActor' ? 'updated' : 'added'} successfully.`);
      onClose();

    } catch (error) {
      console.error(`Error ${mode === 'editActor' ? 'updating' : 'adding'} actor:`, error);
      setErrors({ form: `Failed to ${mode === 'editActor' ? 'update' : 'add'} actor. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-actor-form-modal">
      <div className="add-actor-form-panel">
        <div className="add-actor-form-header">
          <h2>{mode === 'editActor' ? 'Edit Actor' : 'Add Actor'}</h2>
          <button onClick={onClose} className="close-button" aria-label="Close form">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="add-actor-form-content">
          <FormField
            label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Enter actor's first name" errorMessage={errors.name} isRequired
          />
          <FormField
            label="Surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)}
            placeholder="Enter actor's last name" errorMessage={errors.surname} isRequired
          />
          <FormField
            label="Role" type="text" value={role} onChange={(e) => setRole(e.target.value)}
            placeholder="Enter character name" errorMessage={errors.role} isRequired
          />
          <FormField
            label="Photo URL" type="text" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="e.g., src/assets/actors/photo.jpg or http://..." errorMessage={errors.photoUrl}
          />
          {errors.form && <p className="form-field__error main-error">{errors.form}</p>}
          <div className="form-actions">
            <FormSubmit isDisabled={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActorForm;