import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsInViewport } from '@/hooks/useIsInViewport';
import { cn } from '@/lib/utils';

export const WhatIsTrashmobSection = () => {
    const { ref: viewportRef, isInViewPort } = useIsInViewport<HTMLDivElement>();

    return (
        <section id='introduction' className='bg-card'>
            <div className='mx-auto max-w-screen-xl py-8'>
                <div className='px-8 flex flex-col items-center md:grid md:auto-rows-auto md:grid-cols-5 md:gap-x-4'>
                    <div className='col-span-3'>
                        <h3
                            className={cn(
                                '!mt-0 !mb-8 text-[40px] font-semibold',
                                'transition-all duration-1000 delay-300 ease-out',
                                {
                                    'opacity-100 translate-y-0': isInViewPort,
                                    'opacity-0 translate-y-20': !isInViewPort,
                                },
                            )}
                        >
                            What is a TrashMob?
                        </h3>
                    </div>
                    <div className='row-span-4 col-start-4 col-span-2'>
                        <img
                            src='/img/jeremy-bezanger-u5mCQ-c5oSI-unsplash.jpg'
                            alt='What is Trashmob'
                            className={cn('!mt-0', 'transition-all duration-1000 delay-1000 ease-out', {
                                'opacity-100 translate-y-0': isInViewPort,
                                'opacity-0 translate-y-20': !isInViewPort,
                            })}
                        />
                    </div>
                    <div className='row-span-3 col-start-1 col-span-3'>
                        <p
                            className={cn(
                                '!mt-8 md:!mt-0 !mb-16 text-center md:!text-left text-2xl font-normal',
                                'transition-all duration-1000 delay-500 ease-out',
                                {
                                    'opacity-100 translate-y-0': isInViewPort,
                                    'opacity-0 translate-y-20': !isInViewPort,
                                },
                            )}
                        >
                            A TrashMob is a group of citizens who are willing to take an hour or two out of their lives
                            to get together and clean up their communities. Start your impact today.
                        </p>
                        <div
                            className={cn(
                                'flex flex-row justify-center md:justify-start gap-4',
                                'transition-all duration-1000 delay-700 ease-out',
                                {
                                    'opacity-100': isInViewPort,
                                    'opacity-0': !isInViewPort,
                                },
                            )}
                        >
                            <Button asChild size='lg'>
                                <Link to='/aboutus'>Learn more</Link>
                            </Button>
                            <Button asChild size='lg'>
                                <a href='/#events'>View Upcoming Events</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={viewportRef} />
        </section>
    );
};
