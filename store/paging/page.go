package paging

import "strconv"

const MAX_PAGE_SIZE int64 = 100
const DEFAULT_SIZE int64 = 10

type Page struct {
	CurrentPage int
	Size        int
}

func NewFromParams(currentPageParam string, sizeParam string) Page {
	var (
		currentPage int64 = 1
		size        int
		err         error
	)

	if currentPageParam != "" {
		currentPage, err = strconv.ParseInt(currentPageParam, 10, 0)
		if err != nil {
			currentPage = 1
		}
	}

	size = validSize(sizeParam)

	return Page{
		CurrentPage: int(currentPage),
		Size:        size,
	}
}

func validSize(sizeParam string) int {
	var (
		size int64
		err  error
	)

	size, err = strconv.ParseInt(sizeParam, 10, 64)
	if err != nil {
		size = DEFAULT_SIZE
	}

	if size >= MAX_PAGE_SIZE {
		size = MAX_PAGE_SIZE
	}

	return int(size)
}
