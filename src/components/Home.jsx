import React from "react";

import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

import { NavBar } from './NavBar';
import {
    HomeWrapper,
    MainContent,
    Greeting,
    Hobbies,
    HobbyChip,
    HobbyPreview,
    HobbyPreviewWrapper,
    HobbyTitle,
    HobbyDescription,
    HobbyMedia,
    HobbyVideo,
    HobbyEmbed,
    SocialLinks,
    Avatar
} from './HomeStyledComponents';

const greetingLines = ['Howdy, I\'m Ying!', '你好，我是吕滢！'];

const SocialLink = (props) => (
    <a target="_blank" rel="noopener noreferrer" href={props.url}>
        {props.children}
    </a>
);

const hobbies = [
    {
        name: 'Windsurfer',
        description: 'Skill learnt from a youth summer camp',
        mediaType: 'image',
        mediaSrc: 'images/windsurfing.jpg'
    },
    {
        name: 'Latin Dancer',
        description: 'Picking up the new hobby at Broadway Dance Studio',
        mediaType: 'embed',
        mediaSrc: 'https://drive.google.com/file/d/1j6w8idkJPcvQqSZ7ucJJwkKyXOCOYYGC/preview'
    },
    {
        name: 'Tennis Player',
        description: 'Win half of the 2.5 league matches, schedule the lineups as the team captain',
        mediaType: 'image',
        mediaSrc: 'images/tennis.jpg'
    },
    {
        name: 'Runner',
        description: 'Breaking middle school records in 800m, won second place during undergraduate years',
        mediaType: 'image',
        mediaSrc: 'images/running.jpg'
    }
];

const getDisplayedHobbies = (length = 4) => hobbies
    .map((hobby) => ({ ...hobby, randPos: Math.random() }))
    .sort((a, b) => a.randPos - b.randPos)
    .slice(0, length);

export const Home = () => {
    const [activeHobby, setActiveHobby] = React.useState(null);
    const [previewPosition, setPreviewPosition] = React.useState({ top: 0, left: 0 });
    const [displayedGreeting, setDisplayedGreeting] = React.useState('');
    const [greetingIndex, setGreetingIndex] = React.useState(0);
    const displayedHobbies = React.useMemo(() => getDisplayedHobbies(4), []);
    const hobbyRowRef = React.useRef(null);
    const previewRef = React.useRef(null);

    const handleHoverStart = (hobby, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = hobbyRowRef.current?.getBoundingClientRect();
        const top = rect.bottom - (containerRect ? containerRect.top : 0) + 12;
        const left = rect.left - (containerRect ? containerRect.left : 0) + rect.width / 2;

        setPreviewPosition({ top, left });
        setActiveHobby(hobby);
    };

    React.useEffect(() => {
        const handleOutsideClick = (event) => {
            const clickedInsideHobbyRow = hobbyRowRef.current?.contains(event.target);
            const clickedInsidePreview = previewRef.current?.contains(event.target);

            if (!clickedInsideHobbyRow && !clickedInsidePreview) {
                setActiveHobby(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    React.useEffect(() => {
        const fullText = greetingLines[greetingIndex];
        let timeoutId;

        if (displayedGreeting.length < fullText.length) {
            timeoutId = window.setTimeout(() => {
                setDisplayedGreeting(fullText.slice(0, displayedGreeting.length + 1));
            }, 140);
        } else {
            timeoutId = window.setTimeout(() => {
                setDisplayedGreeting('');
                setGreetingIndex((prev) => (prev + 1) % greetingLines.length);
            }, 5000);
        }

        return () => window.clearTimeout(timeoutId);
    }, [displayedGreeting, greetingIndex]);

    return (
        <HomeWrapper>
            <NavBar />
            <MainContent>
                <Avatar picture='images/mark-color.png'></Avatar>
                <Greeting>{displayedGreeting}</Greeting>
                <Hobbies ref={hobbyRowRef}>
                    {displayedHobbies.map((hobby) => (
                        <HobbyChip
                            key={hobby.name}
                            type="button"
                            onMouseEnter={(event) => handleHoverStart(hobby, event)}
                        >
                            {hobby.name}
                        </HobbyChip>
                    ))}
                </Hobbies>

                {activeHobby && (
                    <HobbyPreviewWrapper
                        ref={previewRef}
                        style={{ top: previewPosition.top, left: previewPosition.left }}
                    >
                        <HobbyPreview>
                            <HobbyTitle>{activeHobby.name}</HobbyTitle>
                            <HobbyDescription>{activeHobby.description}</HobbyDescription>
                            {activeHobby.mediaType === 'embed' ? (
                                <HobbyEmbed
                                    src={activeHobby.mediaSrc}
                                    title={activeHobby.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : activeHobby.mediaType === 'video' ? (
                                <HobbyVideo
                                    src={activeHobby.mediaSrc}
                                    title={activeHobby.name}
                                    controls
                                    playsInline
                                    preload="metadata"
                                />
                            ) : activeHobby.mediaSrc ? (
                                <HobbyMedia
                                    src={activeHobby.mediaSrc}
                                    alt={activeHobby.name}
                                />
                            ) : null}
                        </HobbyPreview>
                    </HobbyPreviewWrapper>
                )}

                <SocialLinks>
                    <SocialLink url="https://www.linkedin.com/in/ying-lyu/">
                        <LinkedInIcon style={{ fontSize: 40 }} />
                    </SocialLink>
                    <SocialLink url="https://github.com/yinglyu">
                        <GitHubIcon style={{ fontSize: 40 }} />
                    </SocialLink>
                    <SocialLink url="https://twitter.com/fierce_fly">
                        <TwitterIcon style={{ fontSize: 40 }} />
                    </SocialLink>
                </SocialLinks>
            </MainContent>
        </HomeWrapper>
    );
};