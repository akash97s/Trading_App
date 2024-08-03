import React from 'react';
import { Dropdown, Button, Modal } from 'react-bootstrap';

interface SelectModalProps {
  show: boolean; // Control the visibility of the modal
  onHide: () => void; // Function to close the modal
  onSelect: (choice: string) => void; // Function to handle selection
  currentSelection: string; // Currently selected value
}

const SelectModal: React.FC<SelectModalProps> = ({ show, onHide, onSelect, currentSelection }) => {
  // Choices for the dropdown
  const choices = ['Litecoin', 'Bitcoin', 'Ethereum', 'Dogecoin', 'Solana'];

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Crypto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {currentSelection} {/* Display currently selected value */}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {choices.map((choice, index) => (
              <Dropdown.Item key={index} onClick={() => onSelect(choice)}>
                {choice}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectModal;
