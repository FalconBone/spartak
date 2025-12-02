import { Popover } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import classes from './ItemsString.module.scss'

interface Props {
    items: string[];
    title: string
}

export const ItemsString = ({ items, title }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spanRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const [visibleCount, setVisibleCount] = useState<number>(items.length);

    const calculateVisibleItems = () => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth;
        let totalWidth = 0;
        let count = 0;

        for (let i = 0; i < items.length; i++) {
            const spanEl = spanRefs.current[i];
            if (spanEl) {
                const spanWidth = spanEl.clientWidth;
                if (totalWidth + spanWidth > containerWidth) {
                    break;
                }
                totalWidth += spanWidth;
                count++;
            }
        }

        setVisibleCount(count);
    };

    useEffect(() => {
        // Начальный расчёт после первого рендера
        calculateVisibleItems();

        // Пересчёт при изменении размера окна
        window.addEventListener('resize', calculateVisibleItems);
        return () => window.removeEventListener('resize', calculateVisibleItems);
    }, [items]);

    const hiddenCount = items.length - visibleCount;

    const poopverContent : React.ReactElement = (
        <div>
            {items.map((item) => <p>{item}</p>)}
        </div>
    )

    return (
        <Popover content={poopverContent} title={title}>
            <div
                ref={containerRef}
                className={classes.container}>
                {items.slice(0, visibleCount).map((item, index) => {
                    const width = spanRefs.current[index]?.clientWidth
                    let style = '';
                    if (width !== undefined) {
                        if (width > 80) {
                            style = classes.shortName
                        }
                    }
                    
                    return (
                        <span
                            className={`${classes.item} ${style}`}
                            key={index}
                            //ref={(el) => (spanRefs.current[index] = el)}
                        >
                            {item}
                        </span>
                    )
                })}
                {hiddenCount > 0 && (
                    <span className={classes.countHiddenItems}>{`+${hiddenCount}`}</span>
                )}
            </div>
        </Popover>
    );
};
