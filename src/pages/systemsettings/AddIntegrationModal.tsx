import React from 'react';
import './SystemSettings.css';
import { Integration } from './SystemIntegrationsSettings';

interface AddIntegrationModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (integration: Integration) => void;
  availableIntegrations: Integration[];
}

const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({ show, onClose, onAdd, availableIntegrations }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop-v2">
      <div className="modal-content-v2">
        <div className="modal-header-v2">
          <h5>Добавить новую интеграцию</h5>
          <button onClick={onClose} className="btn-close"></button>
        </div>
        <div className="modal-body-v2">
          <div className="marketplace-filters">
            <input type="text" placeholder="Поиск в маркетплейсе..." className="form-control" />
          </div>
          <div className="marketplace-grid">
            {availableIntegrations.map(integ => (
              <div key={integ.id} className="marketplace-card">
                <div className="marketplace-card-header">
                  <i className={`bi ${integ.icon}`}></i>
                  <h6>{integ.name}</h6>
                </div>
                <p>{integ.description}</p>
                <button className="btn btn-sm btn-outline-primary w-100" onClick={() => onAdd(integ)}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Добавить
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIntegrationModal; 