import React, { Component } from 'react';
// import './Intro.css';
import response from './response';

class Facets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: response.data.categories,
    };
  }

  findMainCategories() {
    const mainCategories = [];
    for (const item of this.state.categories)
      if (item.parent === "0") mainCategories.push(item);
    return this.findChildren(mainCategories);
  }

  findChildren(mainCategories) {
    mainCategories.map((mainCategory) => {
      mainCategory["children"] = [];
      for (const category of this.state.categories) {
        if (mainCategory.id === category.parent) {
          mainCategory["children"].push(category);
        }
      }
      this.findChildren(mainCategory["children"]);
      return mainCategories;
    });
    return mainCategories;
  }

  render() {
    const mainCategories = this.findMainCategories();

    return (
      <div className="">
        <OptionsList
          options={mainCategories}
          onChange={(selectedOptions) => this.setState({ selectedOptions })}
          selectedOptions={this.state.selectedOptions}
        />
      </div>
    );
  }
}

export default Facets;


//Recursive component
const OptionsList = ({ options, selectedOptions, onChange }) => {
  const handleCheckboxClicked = (selectedOptionId) => {
    if (selectedOptions[selectedOptionId]) {
      delete selectedOptions[selectedOptionId];
    } else {
      selectedOptions[selectedOptionId] = {}
    }
    onChange(selectedOptions)
  }

  const handleSubOptionsListChange = (optionId, subSelections) => {
    selectedOptions[optionId] = subSelections;
    onChange(selectedOptions);
  }

  return (
    <div>
      {options.map(option => (
        <ul>
          <Checkbox
            selected={selectedOptions[option.id]}
            label={option.name}
            key={option.id}
            onChange={() => { handleCheckboxClicked(option.id) }}
          />
          {/* Base Case */}
          {(option.children.length > 0 && selectedOptions[option.id]) &&
            <OptionsList
              options={option.children}
              key={option.id}
              selectedOptions={selectedOptions[option.id]}
              onChange={(subSelections) => handleSubOptionsListChange(option.id, subSelections)}
            />
          }
        </ul>
      ))}
    </div>
  )
}

const Checkbox = ({ selected, label, onChange }) => {
  return (
    <div>
      <div
        className=""
        onClick={() => onChange(!selected)}
      />
      <div className="">{label}</div>
    </div>
  )
}