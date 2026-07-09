import { ApiFeatures } from '../utils/apiFeatures.js';

// Generic repository providing common CRUD data-access methods.
// Specific repositories extend this and add model-specific queries.
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id, populate = '') {
    const query = this.model.findById(id);
    if (populate) query.populate(populate);
    return query;
  }

  async findOne(filter = {}, populate = '') {
    const query = this.model.findOne(filter);
    if (populate) query.populate(populate);
    return query;
  }

  async findAll(filter = {}, populate = '') {
    const query = this.model.find(filter);
    if (populate) query.populate(populate);
    return query;
  }

  async findWithFeatures(queryString, { searchFields = [], populate = '' } = {}) {
    let mongooseQuery = this.model.find();
    if (populate) mongooseQuery = mongooseQuery.populate(populate);

    const features = new ApiFeatures(mongooseQuery, queryString)
      .search(searchFields)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const [data, total] = await Promise.all([
      features.query,
      this.model.countDocuments(this._buildCountFilter(queryString, searchFields)),
    ]);

    return {
      data,
      pagination: {
        ...features.pagination,
        total,
        totalPages: Math.ceil(total / features.pagination.limit),
      },
    };
  }

  _buildCountFilter(queryString, searchFields) {
    const queryObj = { ...queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const filter = JSON.parse(queryStr);

    if (queryString.search && searchFields.length > 0) {
      const regex = new RegExp(queryString.search, 'i');
      filter.$or = searchFields.map((field) => ({ [field]: regex }));
    }
    return filter;
  }

  async updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}
