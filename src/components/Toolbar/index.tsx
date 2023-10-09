import React, { useMemo, useState } from "react";
import { FaRedo, FaSearch } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import Dropdown from "../Dropdown";
import {
  DATE_FILTER_OPTIONS,
  DateRangeFilterType,
} from "../../types/dateFilterTypes";
import Modal from "../Modal";
import { useDataStore } from "../../store/DataContext";
import { FILTER_OPTIONS } from "../../_constants/filterOptions";
import { DataFilterType } from "../../types/dataFilterTypes";

interface FilterOptionProps {
  color: string;
  eventName: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterOption: React.FC<FilterOptionProps> = ({
  color,
  eventName,
  checked,
  onChange,
}) => {
  return (
    <div className="filter-option">
      <input
        type="checkbox"
        id={eventName}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={eventName}>
        <span
          className="color-indicator"
          style={{ backgroundColor: color }}
        ></span>
        {eventName}
      </label>
    </div>
  );
};
const defaultCheckedOptions = Object.fromEntries(
  Object.keys(FILTER_OPTIONS).map((eventName) => [eventName, false])
);
const Toolbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchValue, setSearchValue] = useState(""); // Add this line for search value

  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    defaultCheckedOptions
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setCheckedOptions((prevState) => ({ ...prevState, [id]: checked }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { selectedFilter, setSelectedFilter } = useDataStore();

  const handleDropdownChange = (selectedLabel: string) => {
    const filterType = Object.keys(DATE_FILTER_OPTIONS).find(
      (key) =>
        DATE_FILTER_OPTIONS[key as DateRangeFilterType].label === selectedLabel
    ) as DateRangeFilterType;

    if (filterType === "custom") {
      // Open your modal here
      openModal();
    } else {
      const updatedFilter: DataFilterType = {
        ...selectedFilter, // Spread the existing state to maintain other values
        dateFilter: filterType, // Update only the date filter
      };
      setSelectedFilter(updatedFilter);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const onApply = () => {
    setSelectedFilter({
      dateFilter: selectedFilter.dateFilter, // Keep the existing date filter
      eventTypeFilter: checkedOptions, // Update with the current checked options
    });
    setIsVisible(false);
  };

  const onReset = () => {
    setCheckedOptions(defaultCheckedOptions);
  };

  const appliedFilterCount = useMemo(() => {
    return Object.values(selectedFilter.eventTypeFilter).filter(Boolean).length;
  }, [selectedFilter.eventTypeFilter]);

  return (
    <div className="control-panel">
      <div className="icon-wrapper search-input-wrapper">
        <FaSearch size={15} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <Dropdown
          label={DATE_FILTER_OPTIONS[selectedFilter.dateFilter].label}
          options={Object.values(DATE_FILTER_OPTIONS).map(
            (option) => option.label
          )}
          onSelect={handleDropdownChange}
        />
        <div className="icon-wrapper">
          <div onClick={toggleVisibility}>
            <IoFilter size={15} />
            {appliedFilterCount > 0 && (
              <div className="selected-filter-count">{appliedFilterCount}</div>
            )}
          </div>

          {isVisible && (
            <div className="filter-popup">
              <div className="content">
                <div className="section">
                  <div className="section-title">Types</div>
                  <div className="options-list">
                    {Object.entries(FILTER_OPTIONS).map(
                      ([eventName, color]) => (
                        <FilterOption
                          key={eventName}
                          color={color}
                          eventName={eventName}
                          checked={checkedOptions[eventName] || false}
                          onChange={handleCheckboxChange}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button onClick={toggleVisibility} className="close-btn">
                X
              </button>

              {/* Reset and Apply buttons */}
              <div className="button-group">
                <button onClick={onReset} className="ternary-btn">
                  Reset
                </button>
                <button onClick={onApply} className="primary-btn">
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="icon-wrapper">
          <FaRedo size={12} />
        </div>
        {isModalOpen && (
          <Modal type="info" title="Coming Soon!" onClose={closeModal}>
            This date filter range will come soon.
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
