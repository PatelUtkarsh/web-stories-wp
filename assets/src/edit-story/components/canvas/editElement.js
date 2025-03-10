/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useUnits } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import { useState, useRef } from 'react';
import { getDefinitionForType } from '../../elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import SingleSelectionMoveable from './singleSelectionMoveable';

const Wrapper = styled.div`
  ${elementWithPosition}
  ${elementWithSize}
	${elementWithRotation}
	pointer-events: initial;
`;

function EditElement({ element }) {
  const { id, type } = element;
  const { getBox } = useUnits((state) => ({
    getBox: state.actions.getBox,
  }));

  const [editWrapper, setEditWrapper] = useState(null);
  // Needed for elements that can scale in edit mode.
  const [localProperties, setLocalProperties] = useState(null);

  const { Edit, hasEditModeMoveable } = getDefinitionForType(type);
  const box = getBox(
    localProperties ? { ...element, ...localProperties } : element
  );

  const moveable = useRef(null);

  const onResize = () => {
    // Update moveable when resizing.
    if (moveable.current) {
      moveable.current.updateRect();
    }
  };

  return (
    <>
      {/*
        TODO: Investigate
        See https://github.com/google/web-stories-wp/issues/6671
        */}
      {/* eslint-disable-next-line styled-components-a11y/no-static-element-interactions */}
      <Wrapper
        aria-labelledby={`layer-${id}`}
        {...box}
        onMouseDown={(evt) => evt.stopPropagation()}
        ref={setEditWrapper}
      >
        <Edit
          element={
            localProperties ? { ...element, ...localProperties } : element
          }
          box={box}
          editWrapper={hasEditModeMoveable && editWrapper}
          onResize={onResize}
          setLocalProperties={setLocalProperties}
        />
      </Wrapper>
      {hasEditModeMoveable && editWrapper && (
        <SingleSelectionMoveable
          selectedElement={element}
          targetEl={editWrapper}
          isEditMode
          editMoveableRef={moveable}
        />
      )}
    </>
  );
}

EditElement.propTypes = {
  element: PropTypes.object.isRequired,
};

export default EditElement;
