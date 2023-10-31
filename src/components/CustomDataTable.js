//#region imports
import Skeleton from "./SkeletonComponent";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { Col, Input, Row } from "reactstrap";
import { motion } from "framer-motion";
import "@src/@core/scss/react/libs/tables/react-dataTable-component.scss";
import Empty from "./Empty";
import HighlightComponent from "./highlight/index";
import ReactPaginate from "react-paginate";
import tableService from "../services/tableService";
import { useRef } from "react";
//#endregion

const CustomDataTable = ({
  columns,
  refresh,
  url,
  tableName,
  items,
  setItems,
  loading,
  setLoading,
  data,
  noDataText,
  stopSearch,
  disablePageSizeChanger,
  disablePagination,
  filters,
  expandableRows,
  expandableRowsComponent,
  hasExpandableRowsComponentProps,
  conditionalRowStyles,
  extraPayload,
}) => {
  // #region States
  const [filteredData, setFilteredData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(!!disablePageSizeChanger ? -1 : 10);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [additionalPayload, setAdditionalPayload] = useState("");
  const [sortDirection, setSortDirection] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [columnsWithCustomRender, setColumnsWithCustomRender] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [keyWordToHighlight, setKeyWordToHighlight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  //#endregion

  // #region use effects/handlers
  const fetchItems = async (
    url,
    refresh,
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    additionalPayload,
    tableName,
    extraPayload
  ) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const [response, error] = await tableService.getTableUsers(
        url,
        pageNumber,
        pageSize,
        keyword,
        sortColumn,
        sortDirection,
        additionalPayload,
        extraPayload ? extraPayload : ""
      );
      if (response?.data?.success == true) {
        const { result } = response?.data;

        setTotalPages(result?.totalPages);
        if (!disablePagination) {
          setPageSize(result?.pageSize);
        }
        setTotalItems(result?.totalCount);
        setItems(
          result?.items?.map((el, idx) => {
            return {
              ...el,
              srno:
                pageNumber == 1
                  ? idx + 1
                  : `${
                      idx != 9
                        ? `${pageNumber - 1}${idx + 1}`
                        : `${pageNumber}0`
                    }`,
            };
          })
        );
      } else {
      }
    } catch {
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (url) {
      fetchItems(
        url,
        refresh,
        pageNumber,
        pageSize,
        sortColumn,
        sortDirection,
        additionalPayload,
        tableName,
        extraPayload
      );
    }
  }, [
    refresh,
    pageNumber,
    pageSize,
    sortColumn,
    sortDirection,
    additionalPayload,
    tableName,
    url,
    extraPayload,
  ]);

  useEffect(() => {
    if (columns.length > 0) {
      let columns_ = columns.map((el) => {
        if (el.isSearchAble) {
          el.cell = (row) => (
            <HighlightComponent
              value={el.selector(row)}
              keyword={keyWordToHighlight}
            />
          );
        }
        return el;
      });
      setColumnsWithCustomRender(columns_);
    }
  }, [columns, keyWordToHighlight]);

  //#endregion

  // #region Search keyword implementation below
  const handleSearch = async (searchText) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const [response, error] = await tableService.getTableUsers(
        url,
        pageNumber,
        pageSize,
        searchText,
        sortColumn,
        sortDirection,
        additionalPayload,
        extraPayload
      );
      if (response?.data?.success == true) {
        const { result } = response?.data;
        setKeyWordToHighlight(searchText);

        setTotalPages(result?.totalPages);
        if (!disablePagination) {
          setPageSize(result?.pageSize);
        }
        setTotalItems(result?.totalCount);
        setItems(
          result?.items?.map((el, idx) => {
            return {
              ...el,
              srno:
                pageNumber == 1
                  ? idx + 1
                  : `${
                      idx != 9
                        ? `${pageNumber - 1}${idx + 1}`
                        : `${pageNumber}0`
                    }`,
            };
          })
        );
      } else {
        setItems([]);
        setKeyWordToHighlight("");
      }
    } catch (error) {
      setItems([]);
      setKeyWordToHighlight("");
    } finally {
      setIsLoading(false);
      setLoading(false);

      setTimeout(() => {}, 5000);
    }
  };

  const debounceSearchFn = useMemo(() => debounce(handleSearch, 500), []);

  //#endregion

  // #region Function to handle Pagination

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPageSize(newPerPage);
  };

  const handleSort = async (column, sortDirection) => {
    const sortDir = sortDirection?.toUpperCase() || "";
    setSortDirection(sortDir);
    const sortCol = column?.dbField || "";
    setSortColumn(sortCol);
  };

  //#endregion

  // #region Custom Pagination

  const CustomPagination = () => {
    let count = 0;
    if (pageSize > 0) count = Number(Math.ceil(totalItems / pageSize));
    else {
      count = 1;
    }
    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={pageNumber - 1}
        onPageChange={(page, page1) => {
          handlePageChange(page.selected + 1);
        }}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  //#endregion

  return (
    <>
      <motion.div animate={{ opacity: 1 }} className="react-dataTable">
        <DataTable
          noHeader
          subHeader
          sortServer
          responsive
          bordered
          striped
          highlightOnHover
          pagination={!disablePagination}
          paginationServer
          paginationComponent={CustomPagination}
          paginationPerPage={pageSize}
          columns={columnsWithCustomRender}
          noDataComponent={<Empty text={noDataText} />}
          sortIcon={<ChevronDown size={10} />}
          expandableRows={expandableRows}
          expandableRowsComponent={expandableRowsComponent}
          expandableRowsComponentProps={
            hasExpandableRowsComponentProps
              ? { itemsList: searchValue?.length ? filteredData : data }
              : null
          }
          conditionalRowStyles={conditionalRowStyles}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          data={searchValue?.length ? filteredData : data}
          progressPending={isLoading || loading}
          progressComponent={<Skeleton />}
          onSort={handleSort}
          subHeaderComponent={
            <motion.div className="w-100 mb-75">
              <Row>
                {!disablePageSizeChanger && (
                  <Col
                    xl="4"
                    lg="4"
                    md="4"
                    className="d-flex align-items-center p-0"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        ...(!!disablePageSizeChanger ? { opacity: 0 } : {}),
                      }}
                      className="d-flex align-items-center w-100 mb-sm-0 mb-1 me-1 mt-1"
                    >
                      <div className="form-floating">
                        <Input
                          disabled={disablePageSizeChanger || isLoading}
                          className="mx-50"
                          style={{ minWidth: "8rem" }}
                          type="select"
                          id="rows-per-page"
                          value={!!disablePageSizeChanger ? -1 : pageSize}
                          onChange={(e) => {
                            if (!disablePageSizeChanger) {
                              setPageNumber(1);
                              setPageSize(e.target.value);
                            }
                          }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="-1">All</option>
                        </Input>
                        <label
                          style={{
                            transform:
                              "scale(0.85) translateY(-2.25rem) translateX(-0.15rem)",
                            width: "fit-content",
                          }}
                          htmlFor="rows-per-page"
                        >
                          Rows per page
                        </label>
                      </div>
                    </motion.div>
                  </Col>
                )}
                <Col
                  xl="8"
                  lg="8"
                  md="8"
                  className="d-flex align-items-sm-center justify-content-md-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column p-0 mt-md-0 mt-1"
                >
                  {filters &&
                    filters.map((filter, index) => {
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 100 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="d-flex align-items-center mb-sm-0 mb-1 me-1 mt-1"
                        >
                          <div className="form-floating">
                            <Input
                              type="select"
                              disabled={isLoading}
                              className="ms-50 w-100 dataTable_filters_field"
                              id={filter.label + index}
                              onChange={(e) => {
                                let additionalPayload_ = additionalPayload;
                                additionalPayload_ = `&${filter.name}=${e.target.value}`;
                                setAdditionalPayload(additionalPayload_);
                              }}
                            >
                              {filter.options.map((option, index) => {
                                return (
                                  <option value={option.value}>
                                    {option.label}
                                  </option>
                                );
                              })}
                            </Input>
                            <label
                              style={{
                                transform:
                                  "scale(0.85) translateY(-2.25rem) translateX(-0.15rem)",
                              }}
                              htmlFor={filter.label + index}
                            >
                              {filter.label}
                            </label>
                          </div>
                        </motion.div>
                      );
                    })}
                  {!stopSearch && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="d-flex align-items-center mb-sm-0 mb-1 me-1 mt-1"
                    >
                      <div className="form-floating">
                        <Input
                          placeholder=" "
                          className="ms-50 w-100"
                          type="text"
                          id="search-input"
                          value={keyword}
                          onChange={(e) => {
                            if (!stopSearch) {
                              setKeyword(e.target.value);
                              //debounceSearchFn(e.target.value);
                            }
                          }}
                          ref={searchInputRef}
                        />
                        <label
                          style={{
                            transform:
                              "scale(0.85) translateY(-2.25rem) translateX(-0.15rem)",
                          }}
                          htmlFor={"search-input"}
                        >
                          Search
                        </label>
                      </div>
                    </motion.div>
                  )}
                </Col>
              </Row>
            </motion.div>
          }
        />
      </motion.div>
    </>
  );
};

export default CustomDataTable;
