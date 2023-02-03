import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

export const RemixIcon = ({icon}) => <svg className="remix">
    <use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
</svg>