import { render, screen } from '@testing-library/react';

import Featured from './Featured';

describe('Featured Component', () => {

    describe('Delivery', () => {
        test('renders delivery correctly', () => { 
            render(<Featured />)
            const textElement = screen.getByText('Free Delivery')
            expect(textElement).toBeInTheDocument()
        })

        test('renders price correctly', () => { 
            render(<Featured />)
            const textElement = screen.getByText('Over $3000')
            expect(textElement).toBeInTheDocument()
        })
    })
});