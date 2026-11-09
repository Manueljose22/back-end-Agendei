"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchSpecialitiesServices = void 0;
class SearchSpecialitiesServices {
    specialityRepository;
    constructor(specialityRepository) {
        this.specialityRepository = specialityRepository;
    }
    async execute(query) {
        const specialities = await this.specialityRepository.findSearch(query);
        return specialities;
    }
}
exports.SearchSpecialitiesServices = SearchSpecialitiesServices;
