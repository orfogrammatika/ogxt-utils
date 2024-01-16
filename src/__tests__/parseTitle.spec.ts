import {parseTitle} from '../parseTitle';

describe('parseTitle', function () {
    it('single line', function () {
        const test = parseTitle('title');
        expect(test).toEqual('title…');
    });
    it('multi line', function () {
        const test = parseTitle('title\nwith subtitle');
        expect(test).toEqual('title with subtitle…');
    });
    it('works with emoji and unicode', function () {
        const test = parseTitle(`Доброго субботнего, дорогие мои девушки💗
На выходных предлагаю всем сбавить темп и отдохнуть от тренировок 😜`);
        expect(test).toEqual('Доброго субботнего, дорогие мои девушки💗…');
    });
});
