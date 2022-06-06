import { multiply } from 'mathjs'

interface Props {
    w: number
    flangeLWR: number
    flangeLWRAdd: number
    l: number
    m_1: number
    i_1: number
    j_1: number
    m_2: number
    i_2: number
    j_2: number
    mExtra: number
    mExtraAdd: number
    flangeUPR: number
    flangeUPRAdd: number
}

const CalcMatrix = ({
    w,
    flangeLWR,
    flangeLWRAdd,
    l,
    m_1,
    i_1,
    j_1,
    m_2,
    i_2,
    j_2,
    mExtra,
    mExtraAdd,
    flangeUPR,
    flangeUPRAdd,
}: Props): number[][] => {
    var target = w
    var omega2 = Math.pow(target, 2)

    //Value 01 : Flange Lower -> 1
    var flgLwrOrigin = flangeLWR
    var flgLwrAdd = flangeLWRAdd

    //Value 02 : Mass -> 6
    // M, J : TYPE 1
    var mOrigin_1 = m_1
    var jOrigin_1 = j_1
    var mHalf_1 = mOrigin_1 / 2
    var jHalf_1 = jOrigin_1 / 2

    // M, J :TYPE 2
    var mOrigin_2 = m_2
    var jOrigin_2 = j_2
    var mHalf_2 = mOrigin_2 / 2
    var jHalf_2 = jOrigin_2 / 2

    var eOrigin = 210000000000

    // L
    var lOrigin = l
    var lHalf = lOrigin / 2
    var lHalf2 = Math.pow(lHalf, 2)
    var lHalf3 = Math.pow(lHalf, 3)

    // I : TYPE 1
    var iOrigin_1 = i_1
    // I : TYPE 1
    var iOrigin_2 = i_2

    //Value 03 : Mass Exteranl -> 1
    var mExtraOrigin = mExtra
    var mExtralAdd = mExtraAdd

    //Value 04 : Flange Upper -> 1
    var flgUprOrigin = flangeUPR
    var flgUprAdd = flangeUPRAdd

    /*
     **
     ** MATRIX -> F * 2 + M * 4 + K * 2 + Ex * 1
     **
     */

    // F * 2
    var matFlangeLower = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, -omega2 * flgLwrAdd, 1.0, 0.0],
        [-omega2 * flgLwrOrigin, 0.0, 0.0, 1.0],
    ]
    var matFlangeUpper = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, -omega2 * flgUprAdd, 1.0, 0.0],
        [-omega2 * flgUprOrigin, 0.0, 0.0, 1.0],
    ]

    // M * 4 / : TYPE 1
    var matM_half_1 = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, -omega2 * jHalf_1, 1.0, 0.0],
        [-omega2 * mHalf_1, 0.0, 0.0, 1.0],
    ]
    // M * 4 / : TYPE 2
    var matM_half_2 = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, -omega2 * jHalf_2, 1.0, 0.0],
        [-omega2 * mHalf_2, 0.0, 0.0, 1.0],
    ]

    // Ex * 1
    var matExtraMass = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0],
    ]
    // K * 2 / : TYPE 1
    var matK_half_1 = [
        [1.0, lHalf, lHalf2 / (2 * eOrigin * iOrigin_1), -lHalf3 / (6 * eOrigin * iOrigin_1)],
        [0.0, 1.0, lHalf / (eOrigin * iOrigin_1), -lHalf2 / (2 * eOrigin * iOrigin_1)],
        [0.0, 0.0, 1.0, -lHalf],
        [0.0, 0.0, 0.0, 1.0],
    ]
    // K * 2 / : TYPE 2
    var matK_half_2 = [
        [1.0, lHalf, lHalf2 / (2 * eOrigin * iOrigin_2), -lHalf3 / (6 * eOrigin * iOrigin_2)],
        [0.0, 1.0, lHalf / (eOrigin * iOrigin_2), -lHalf2 / (2 * eOrigin * iOrigin_2)],
        [0.0, 0.0, 1.0, -lHalf],
        [0.0, 0.0, 0.0, 1.0],
    ]

    const col01: any = {
        tag: ['mFLWR', 'mHlf11', 'mK1', 'mHlf12', 'mExtra', 'mHlf21', 'mK2', 'mHlf22', 'mFUPR'],
        mFLWR: matFlangeLower,
        mHlf11: matM_half_1,
        mK1: matK_half_1,
        mHlf12: matM_half_1,
        mExtra: matExtraMass,
        mHlf21: matM_half_2,
        mK2: matK_half_2,
        mHlf22: matM_half_2,
        mFUPR: matFlangeUpper,
    }

    var result = [
        [1.0, 0.0, 0.0, 0.0],
        [0.0, 1.0, 0.0, 0.0],
        [0.0, 0, 1.0, 0.0],
        [0, 0.0, 0.0, 1.0],
    ]

    for (var t = col01.tag.length - 1; t >= 0; t--) {
        // console.log(t);
        result = multiply(result, col01[col01.tag[t]])
    }

    return result
}

export default CalcMatrix
