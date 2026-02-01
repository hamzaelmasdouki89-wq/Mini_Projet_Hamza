import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  User,
  Shield,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import "./Users.css";

function Users() {
  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/users";
  const user = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      console.log("Users fetched:", res.data);
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, targetUserAdmin) => {
    if (targetUserAdmin && user.admin) {
      setError(
        "Un administrateur ne peut pas supprimer un autre administrateur",
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) {
      try {
        await axios.delete(`${API}/${userId}`);
        setUsers(users.filter((u) => u.id !== userId));
        setSuccess("Utilisateur supprimé avec succès");
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const handlePromoteUser = async (userId, currentAdminStatus) => {
    const actionLabel = currentAdminStatus ? "rétrograder" : "promouvoir";
    const confirmMessage = currentAdminStatus
      ? "Êtes-vous sûr de vouloir rétrograder cet administrateur en utilisateur normal?"
      : "Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur?";

    if (window.confirm(confirmMessage)) {
      try {
        const updatedUser = {
          ...users.find((u) => u.id === userId),
          admin: !currentAdminStatus,
        };

        await axios.put(`${API}/${userId}`, updatedUser);
        setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));

        const successMsg = currentAdminStatus
          ? "Utilisateur rétrogradé avec succès"
          : "Utilisateur promu en administrateur avec succès";
        setSuccess(successMsg);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(`Erreur lors de la ${actionLabel} de l'utilisateur`);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleEditUser = (userData) => {
    setEditingUser({ ...userData });
  };

  const handleSaveUser = async () => {
    try {
      await axios.put(`${API}/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      setSuccess("Utilisateur mis à jour avec succès");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleEditChange = (field, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredUsers = users
    .filter(
      (u) =>
        u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.pseudo.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((u) => {
      if (filterAdmin === "all") return true;
      if (filterAdmin === "admin") return u.admin === true;
      if (filterAdmin === "user") return u.admin !== true;
      return true;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterAdmin]);

  if (!user || user.admin !== true) {
    return (
      <div className="users-container">
        <div className="access-denied">
          <Shield size={48} />
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-wrapper">
        <div className="users-header">
          <div className="header-top">
            <h2>Gestion des Utilisateurs</h2>
            <p className="user-count">{filteredUsers.length} utilisateurs</p>
          </div>

          <div className="search-filter-section">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterAdmin === "all" ? "active" : ""}`}
                onClick={() => setFilterAdmin("all")}>
                Tous
              </button>
              <button
                className={`filter-btn ${filterAdmin === "admin" ? "active" : ""}`}
                onClick={() => setFilterAdmin("admin")}>
                <Shield size={12} />
                Admins
              </button>
              <button
                className={`filter-btn ${filterAdmin === "user" ? "active" : ""}`}
                onClick={() => setFilterAdmin("user")}>
                <User size={12} />
                Utilisateurs
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            <XCircle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <User size={40} />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Pseudo</th>
                    <th>Âge</th>
                    <th>Pays</th>
                    <th>Devise</th>
                    <th>Couleur</th>
                    <th>Statut</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((userData) =>
                    editingUser?.id === userData.id ? (
                      <tr key={userData.id} className="editing-row">
                        <td>
                          <input
                            type="text"
                            value={editingUser.prenom}
                            onChange={(e) =>
                              handleEditChange("prenom", e.target.value)
                            }
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingUser.nom}
                            onChange={(e) =>
                              handleEditChange("nom", e.target.value)
                            }
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                              handleEditChange("email", e.target.value)
                            }
                            className="edit-input"
                          />
                        </td>
                        <td colSpan="6"></td>
                        <td className="actions-cell">
                          <button
                            className="btn-action btn-save"
                            onClick={handleSaveUser}
                            title="Enregistrer">
                            <CheckCircle size={14} />
                          </button>
                          <button
                            className="btn-action btn-cancel"
                            onClick={handleCancelEdit}
                            title="Annuler">
                            <XCircle size={14} />
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={userData.id}>
                        <td>
                          <span
                            className="prenom"
                            data-tooltip={userData.prenom}>
                            {userData.prenom}
                          </span>
                        </td>
                        <td>
                          <span className="nom" data-tooltip={userData.nom}>
                            {userData.nom}
                          </span>
                        </td>
                        <td>
                          <span className="email" data-tooltip={userData.email}>
                            {userData.email}
                          </span>
                        </td>
                        <td>
                          <span
                            className="pseudo"
                            data-tooltip={`@${userData.pseudo}`}>
                            @{userData.pseudo}
                          </span>
                        </td>
                        <td>
                          <span className="age" data-tooltip={userData.age}>
                            {userData.age}
                          </span>
                        </td>
                        <td>
                          <span className="pays" data-tooltip={userData.Pays}>
                            {userData.Pays}
                          </span>
                        </td>
                        <td>
                          <span
                            className="devise"
                            data-tooltip={userData.Devise}>
                            {userData.Devise}
                          </span>
                        </td>
                        <td>
                          <div className="color-badge">
                            <div
                              className="color-dot"
                              style={{
                                backgroundColor: userData.couleur,
                              }}></div>
                          </div>
                        </td>
                        <td>
                          {userData.admin ? (
                            <span className="status-admin">
                              <Shield size={12} />
                              Admin
                            </span>
                          ) : (
                            <span className="status-user">
                              <User size={12} />
                              User
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn-action btn-view"
                              onClick={() => setSelectedUser(userData)}
                              title="Voir">
                              <Eye size={14} />
                            </button>
                            <button
                              className="btn-action btn-edit"
                              onClick={() => handleEditUser(userData)}
                              title="Modifier">
                              <Edit2 size={14} />
                            </button>
                            <button
                              className={`btn-action ${userData.admin ? "btn-demote" : "btn-promote"}`}
                              onClick={() =>
                                handlePromoteUser(userData.id, userData.admin)
                              }
                              title={
                                userData.admin
                                  ? "Rétrograder en utilisateur"
                                  : "Promouvoir en administrateur"
                              }>
                              <Crown size={14} />
                            </button>
                            <button
                              className="btn-action btn-delete"
                              onClick={() =>
                                handleDeleteUser(userData.id, userData.admin)
                              }
                              disabled={userData.admin && user.admin}
                              title={
                                userData.admin && user.admin
                                  ? "Impossible de supprimer un administrateur"
                                  : "Supprimer"
                              }>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Page précédente">
                  <ChevronLeft size={16} />
                </button>
                <span className="pagination-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  title="Page suivante">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedUser(null)}>
              <XCircle size={20} />
            </button>

            <div className="modal-header">
              <div
                className="avatar-large"
                style={{ backgroundColor: selectedUser.couleur }}>
                {selectedUser.prenom.charAt(0).toUpperCase()}
                {selectedUser.nom.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>
                  {selectedUser.prenom} {selectedUser.nom}
                </h3>
                <p>@{selectedUser.pseudo}</p>
                {selectedUser.admin && (
                  <div className="admin-label">
                    <Shield size={12} />
                    Administrateur
                  </div>
                )}
              </div>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{selectedUser.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Pseudo</span>
                  <span className="value">@{selectedUser.pseudo}</span>
                </div>
                <div className="info-item">
                  <span className="label">Âge</span>
                  <span className="value">{selectedUser.age} ans</span>
                </div>
                <div className="info-item">
                  <span className="label">Pays</span>
                  <span className="value">{selectedUser.Pays}</span>
                </div>
                <div className="info-item">
                  <span className="label">Devise</span>
                  <span className="value">{selectedUser.Devise}</span>
                </div>
                <div className="info-item">
                  <span className="label">Couleur</span>
                  <div className="color-value">
                    <div
                      className="color-dot-large"
                      style={{ backgroundColor: selectedUser.couleur }}></div>
                    <span className="value">{selectedUser.couleur}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
