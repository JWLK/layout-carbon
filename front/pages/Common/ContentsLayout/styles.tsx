import styled from '@emotion/styled'

export const PageTypeWide = styled.div`
    margin: 3rem 2rem;
`
export const Header = styled.header`
    width: 100%;
    margin: 1rem auto;
    font-weight: 700;
    font-size: 2.5rem;
    line-height: 2.7rem;
    letter-spacing: 0px;
    & p {
        margin-top: 5px;
        padding: 0px 5px;
        font-weight: 400;
        font-size: 1.3rem;
        line-height: 2rem;
        color: #c6c6c6;
    }
    @media (max-width: 671px) {
        font-size: 30px;
        line-height: 36px;
        & p {
            font-size: 14px;
            line-height: 21px;
        }
    }
`
export const Section = styled.div`
    width: 100%;
    margin: 1rem auto;

    & h3 {
        margin: 0.5rem auto;
    }

    & article > div {
        margin-block: 0.5rem;
    }
`

export const SectionDivider = styled.div`
    width: 100%;
    height: 1px;
    margin: 2rem auto;
    background-color: #393939;
`
