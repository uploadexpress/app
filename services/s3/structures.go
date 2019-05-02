package s3

type FilePart struct {
	ETag       string `json:"e_tag"`
	PartNumber int64  `json:"part_number"`
}

type PartList struct {
	Parts []FilePart `json:"parts"`
}
