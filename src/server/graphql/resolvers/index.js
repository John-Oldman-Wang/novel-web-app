const Novel = require('../../models/novel');
const Chapter = require('../../models/chapter');

const transformChapter = (chapter) => {
    return {
        ...chapter._doc,
        _id: chapter.id,
        novel: fetchNovel.bind(null, chapter.novel)
    };
};

const transformNovel = (novel) => {
    return {
        ...novel._doc,
        _id: novel.id,
        chapters: fetchChapters.bind(null, novel.chapters)
    };
};

const fetchNovel = async (id) => {
    try {
        const novel = await Novel.findById(id);
        return transformNovel(novel);
    } catch (error) {
        return Promise.reject(error);
    }
};

const fetchChapters = async (ids) => {
    // const chapters = await Promise.all(ids.map((id) => Chapter.findById(id)));

    const chapters = await Chapter.find({ _id: { $in: ids } });

    const idsMap = ids.reduce((obj, item, index) => {
        obj[item.toString()] = index;
        return obj;
    }, {});

    chapters.sort((chapter1, chapter2) => {
        return idsMap[chapter1._id.toString()] - idsMap[chapter2._id.toString()];
    });

    return chapters.map((chapter) => {
        return transformChapter(chapter);
    });
};

const fetchChapter = async (id) => {
    try {
        const chapter = await Chapter.findById(id);
        return transformChapter(chapter);
    } catch (error) {
        return Promise.reject(error);
    }
};

const rootResolver = {
    chapter: async ({ id }) => {
        return fetchChapter(id);
    },
    novel: async ({ id }) => {
        return fetchNovel(id);
    },
    randomNovels: async ({ amount }) => {
        const novels = await Novel.random(amount);
        return novels.map((novel) => transformNovel(novel));
    }
};

module.exports = rootResolver;
