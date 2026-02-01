export const validateRequest = (formData) => {
  const errors = [];

  // Titre validation
  if (!formData.titre || !formData.titre.trim()) {
    errors.push("Le titre est requis");
  } else if (formData.titre.trim().length < 5) {
    errors.push("Le titre doit avoir au moins 5 caractères");
  } else if (formData.titre.length > 100) {
    errors.push("Le titre ne peut pas dépasser 100 caractères");
  }

  // Description validation
  if (!formData.description || !formData.description.trim()) {
    errors.push("La description est requise");
  } else if (formData.description.trim().length < 10) {
    errors.push("La description doit avoir au moins 10 caractères");
  } else if (formData.description.length > 1000) {
    errors.push("La description ne peut pas dépasser 1000 caractères");
  }

  return errors;
};

export const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, "").trim();
};
