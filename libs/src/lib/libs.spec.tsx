import { render } from '@testing-library/react';

import TempNxWorkspaceLibs from './libs';

describe('TempNxWorkspaceLibs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TempNxWorkspaceLibs />);
    expect(baseElement).toBeTruthy();
  });
});
