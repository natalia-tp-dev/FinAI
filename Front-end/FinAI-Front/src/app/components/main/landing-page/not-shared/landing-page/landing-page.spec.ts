import { render, screen } from '@testing-library/angular'
import { LandingPage } from './landing-page'
import { Navigation } from '../../shared/navigation/navigation'
import { Hero } from '../../shared/hero/hero'
import { Features  } from '../../shared/features/features'
import { LearnMore } from '../../shared/learn-more/learn-more'

//Intersection Observer mock
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.prototype.observe = vi.fn();
mockIntersectionObserver.prototype.unobserve = vi.fn();
mockIntersectionObserver.prototype.disconnect = vi.fn();
window.IntersectionObserver = mockIntersectionObserver;

describe('LandingPage (Smoke test)', () => {
  //Test for page render
  it('Should render the page and show the main sections', async () => {
    await render(LandingPage, {
      imports: [Navigation, Hero, Features, LearnMore]
    })

    //Verify the components role creation
    expect(screen.getByRole('navigation')).toBeTruthy()

    //Verify HTML key content
    expect(screen.getByText(/Everything you need/i)).toBeTruthy()
    expect(screen.getByText(/Built for/i)).toBeTruthy()
    expect(screen.getByText(/Start managing your money smarter./i)).toBeTruthy()

  })
  //Test for components IDs
  it('Should have navigation anchors configured (#hero, #features)', async () => {
    const { container } = await render(LandingPage, {
      imports: [Navigation, Hero, Features, LearnMore]
    })

    //Verify that the IDs exist so the scroll works
    expect(container.querySelector('#hero')).toBeTruthy()
    expect(container.querySelector('#features')).toBeTruthy()
    expect(container.querySelector('#learn-more')).toBeTruthy()
  })
})
