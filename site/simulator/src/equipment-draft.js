export function createEquipmentDraft({ read, restore, commit, onEditing }) {
  let saved = null;
  return {
    get editing() { return saved !== null; },
    begin() { if (saved !== null) return; saved = { ...read() }; onEditing(true); },
    apply() { if (saved === null) return; commit(); saved = null; onEditing(false); },
    cancel() { if (saved === null) return; restore(saved); saved = null; onEditing(false); }
  };
}
