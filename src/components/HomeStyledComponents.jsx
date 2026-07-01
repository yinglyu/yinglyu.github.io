import Styled from '@emotion/styled';

export const HomeWrapper = Styled.div`
    background-color: skyBlue;
    background-size: cover;
    height: 100%;
    overflow: hidden;
`;

export const MainContent = Styled.div`
    position: relative;
    color: white;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
        flex-direction: column;
    min-height: 100vh;
    max-width: 75%;
    margin-left: 12.5%;
    -ms-flex-pack: center;
        justify-content: center;
    text-align: center;
`;

export const Greeting = Styled.div`
    font-family: 'Roboto', sans-serif;
    font-size: 4.20em;
    font-weight: 720;
    min-height: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Hobbies = Styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin: 1.0rem 0 1.5rem;
    font-size: 1.5em;
    font-weight: 100;
`;

export const HobbyChip = Styled.button`
    background: rgba(255,255,255,0.18);
    color: white;
    border: 1px solid rgba(255,255,255,0.35);
    border-radius: 999px;
    padding: 0.5rem 0.9rem;
    cursor: pointer;
    font-size: 1rem;
    transition: transform 0.2s ease, background 0.2s ease;
    &:hover {
        background: rgba(255,255,255,0.3);
        transform: translateY(-2px);
    }
    &:after {
        content: ' hover';
        margin-left: 0.35rem;
        font-size: 0.75rem;
        opacity: 0.85;
    }
`;

export const HobbyPreviewWrapper = Styled.div`
    position: absolute;
    z-index: 20;
    pointer-events: auto;
    width: min(92vw, 34rem);
    transform: translate(-50%, 0);
`;

export const HobbyPreview = Styled.div`
    width: 100%;
    padding: 0.85rem 0.85rem 1rem;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(6px);
    min-height: 24rem;
`;

export const HobbyTitle = Styled.h3`
    margin: 0 0 0.35rem;
    font-size: 1.2rem;
`;

export const HobbyDescription = Styled.p`
    margin: 0 0 0.55rem;
    font-size: 0.95rem;
    line-height: 1.5;
    white-space: pre-line;
    text-align: left;
`;

export const HobbyMedia = Styled.img`
    width: 100%;
    max-height: 18rem;
    height: 18rem;
    object-fit: cover;
    border-radius: 0.75rem;
`;

export const HobbyVideo = Styled.video`
    width: 100%;
    max-height: 240px;
    border: 0;
    border-radius: 0.75rem;
    background: #000;
    object-fit: contain;
`;

export const HobbyEmbed = Styled.iframe`
    width: 100%;
    min-height: 18rem;
    height: 18rem;
    border: 0;
    border-radius: 0.75rem;
    background: #000;
`;

export const SocialLinks = Styled.div`
    font-size: 2.2em;
    & > a {
        margin: 0 0.5rem 0 0.5rem
    }
`;

export const Avatar = Styled.img`
    margin-left: auto;
    margin-right: auto; 
    background-image: url(${props => props.picture});
    width: 250px;
    height: 250px;
    background-size: cover;
    background-position: top center;
    border-radius: 50%;
`